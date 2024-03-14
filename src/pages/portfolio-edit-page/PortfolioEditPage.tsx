import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useRef, useState } from "react";
import { ErrorCode, FileRejection, useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { unstable_useBlocker as useBlocker, useLocation } from "react-router-dom";
import styled from "styled-components";
import * as Yup from "yup";

import { Query as GraphqlQuery, UserEntity } from "../../../generated-graphql/graphql";
import { uploadImageFile } from "../../api/upload";
import { verifyEmailWithLogin } from "../../api/verify-email";
import { ApolloActionType, ClientType, apolloClient } from "../../core/clients/apolloClient";
import greenCheckSrc from "../../assets/images/green-check.svg";
import { CrossImage, ErrorIconImage, ImagePlaceholderImage, OceanaCoinImage, WrongImagePlaceholderImage } from "../../components/assets/app-images/AppImages";
import BackButton from "../../components/button/back-button/BackButton";
import BorderedButton from "../../components/button/bordered-button/BorderedButton";
import PencilOverlayWithLoader from "../../components/image/pencil-overlay-with-loader/PencilOverlayWithLoader";
import ClearData from "../../components/input/clear-data/ClearData";
import { FormPrompt } from "../../components/prompt/Prompt";
import { Body2Bold, ButtonPrimary, ButtonSecondarySmall, Flex, H2 } from "../../components/styleguide/styleguide";
import { AVATAR_IMAGE_SIZE_LIMIT, COVER_IMAGE_SIZE_LIMIT, SUPPORTED_IMAGE_FORMATS } from "../../core/constants/base.const";
import { ErrorMessages, InfoMessages } from "../../core/constants/messages.const";
import { RESPONSIVE } from "../../core/constants/responsive.const";
import { colors } from "../../core/constants/styleguide.const";
import { ImageVariant } from "../../core/enums/image-variant.enum";
import { generateHasDuplicatedEmailQuery, generateHasDuplicatedFullNameQuery } from "../../core/graphql-queries/backend-queries/duplication-check.query";
import { useAppDispatch, useAppSelector } from "../../core/hooks/rtkHooks";
import { setShowShareProfileModal } from "../../core/store/slices/modalSlice";
import * as participantsActions from "../../core/store/slices/participantsSlice";
import * as userActions from "../../core/store/slices/userSlice";
import { isValidImageDimension } from "../../core/util/image.util";
import { validateEmail } from "../../core/util/string.util";
import BasePage from "../base-page/BasePage";
import "./portfolio-edit-page.scss";
import Verified from "./verified/Verified";
import ReactRouterPrompt from "react-router-prompt";
import { ProceedPrompt } from "../../components/prompt/ProceedPrompt";

const STRING_SPECIAL_PATTERN = /^(?=.*[a-zA-Z])[A-Za-z0-9\D\M]+$/;

type ModalForm = {
  username: string;
  email: string;
  description: string;
  file: FileList | null;
  cover: FileList | null;
};

const PortfolioEditPage = () => {
  const dispatch = useAppDispatch();
  const { hash } = useLocation();

  const profile = useAppSelector(state => state.user.profile);

  // form
  const [updating, setUpdating] = useState(false);
  const [edited, setEdited] = useState(false);
  const editFormRef = useRef<HTMLFormElement>(null);

  // email
  const [sendingEmail, setSendingEmail] = useState(false);
  const [isValidatingEmail, setIsValidatingEmail] = useState(false);
  const [secondsCountdown, setSecondsCountdown] = useState<number | null>(null);
  const [counterIntervalId, setCounterIntervalId] = useState<NodeJS.Timer>();

  // image related states
  const [hoveringAvatarImage, setHoveringAvatarImage] = useState(false);
  const [hoveringBannerImage, setHoveringBannerImage] = useState(false);
  const [hasAvatarImageSizeError, setHasAvatarImageSizeError] = useState(false);
  const [hasAvatarImageDimensionError, setHasAvatarImageDimensionError] = useState(false);
  const [hasAvatarImageFileFormatError, setHasAvatarImageFileFormatError] = useState(false);
  const [hasCoverImageSizeError, setHasCoverImageSizeError] = useState(false);
  const [hasCoverImageDimensionError, setHasCoverImageDimensionError] = useState(false);
  const [hasCoverImageFileFormatError, setHasCoverImageFileFormatError] = useState(false);

  const hasAvatarImageError = hasAvatarImageDimensionError || hasAvatarImageFileFormatError || hasAvatarImageSizeError;
  const hasCoverImageError = hasCoverImageDimensionError || hasCoverImageFileFormatError || hasCoverImageSizeError;

  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);

  const clearAvatarImageErrors = () => {
    setHasAvatarImageSizeError(false);
    setHasAvatarImageDimensionError(false);
    setHasAvatarImageFileFormatError(false);
  };
  const clearCoverImageErrors = () => {
    setHasCoverImageSizeError(false);
    setHasCoverImageDimensionError(false);
    setHasCoverImageFileFormatError(false);
  };

  const yupValidationSchema = Yup.object().shape({
    username: Yup.string()
      .trim()
      .max(50, "Username cannot exceed 50 characters.")
      .test(
        "match-regex",
        "Username cannot contain only special characters.",
        (username) => {
          if (username?.length === 0) {
            return true;
          }
          return STRING_SPECIAL_PATTERN.test(username as string);
        }
      )
      .test(
        "existsCheck",
        "Username is taken.",
        async (value) => {
          if (!!value) {
            const { hasDuplicatedFullName }: GraphqlQuery = await apolloClient(
              ClientType.GRAPHQL,
              ApolloActionType.QUERY,
              generateHasDuplicatedFullNameQuery(value)
            );
            return !hasDuplicatedFullName as boolean;
          }
          return true;
        }
      ),
    description: Yup.string()
      .nullable()
      .max(
        250,
        "Bio cannot exceed 250 characters."
      ),
  });

  // useForm hook
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    resetField,
    formState: { errors },
    trigger,
    clearErrors,
    setFocus,
  } = useForm<ModalForm>({
    resolver: yupResolver(yupValidationSchema),
    criteriaMode: "all"
  });
  
  useEffect(() => {
    if(profile?.emailVerified === true){
      setSecondsCountdown(0);
    }
  }, [profile?.emailVerified]);

  useEffect(() => {
    setValue("username", (profile.fullName || "") as string);
    setValue("description", (profile.bio && profile.bio !== "null" ? profile.bio : "") as string);
  }, [profile.fullName, profile.bio]);

  useEffect(() => {
    setValue("email", profile.email && profile.email !== "null" ? profile.email : "");
  }, [profile.email]);

  const username = watch("username");
  const description = watch("description");
  const email = watch("email");
  const avatarFiles = watch("file");
  const coverFiles = watch("cover");
  const avatarPreviewUrl = hasAvatarImageFileFormatError ? WrongImagePlaceholderImage().props.src
    : hasAvatarImageDimensionError || hasAvatarImageSizeError ? ImagePlaceholderImage().props.src
      : avatarFiles?.item(0) ? URL.createObjectURL(avatarFiles.item(0) as File) : "";
  const coverPreviewUrl = hasCoverImageFileFormatError ? WrongImagePlaceholderImage().props.src
    : hasCoverImageDimensionError || hasCoverImageSizeError ? ImagePlaceholderImage().props.src
      : coverFiles?.item(0) ? URL.createObjectURL(coverFiles.item(0) as File) : "";
  const lengthOfDescription = description?.length || 0;

  const [emailErrorMessage, setEmailErrorMessage] = useState("");

  const hasErrors = Object.keys(errors).length > 0 || hasAvatarImageError || hasCoverImageError || !!emailErrorMessage;

  // callback functions for useDropzone hook
  const onDropAccepted = async (acceptedFiles: File[], imageVariant: ImageVariant) => {
    const isAvatar = imageVariant === ImageVariant.Avatar;
    if (acceptedFiles?.length > 0) {
      const imgUrl = URL.createObjectURL(acceptedFiles[0]);
      if (!(await isValidImageDimension(imgUrl, imageVariant))) {
        isAvatar ? setHasAvatarImageDimensionError(true) : setHasCoverImageDimensionError(true);
      }
      const dataTransfer = new DataTransfer();
      acceptedFiles.map(file => dataTransfer.items.add(file));
      setValue(isAvatar ? "file" : "cover", dataTransfer.files);
    }
  };
  const onDropRejected = async (fileRejections: FileRejection[], imageVariant: ImageVariant) => {
    const isAvatar = imageVariant === ImageVariant.Avatar;
    isAvatar ? clearAvatarImageErrors() : clearCoverImageErrors();

    if (fileRejections) {
      const dataTransfer = new DataTransfer();
      const imgUrl = URL.createObjectURL(fileRejections[0].file);

      // check image dimension
      try {
        if (!(await isValidImageDimension(imgUrl, imageVariant))) {
          isAvatar ? setHasAvatarImageDimensionError(true) : setHasCoverImageDimensionError(true);
        }
      }
      catch (e) {
        console.log(e);
      }

      // check file size and format
      fileRejections.map(fileRejection => {
        dataTransfer.items.add(fileRejection.file);

        fileRejection.errors.map(error => {
          if (error.code === ErrorCode.FileTooLarge) {
            isAvatar ? setHasAvatarImageSizeError(true) : setHasCoverImageSizeError(true);
          }
          else if (error.code === ErrorCode.FileInvalidType) {
            isAvatar ? setHasAvatarImageFileFormatError(true) : setHasCoverImageFileFormatError(true);
          }
        });
      });
      setValue(isAvatar ? "file" : "cover", dataTransfer.files);
    }
  };

  // Dropzone hook for Avatar Image Editor
  const {
    getRootProps: getAvatarRootProps,
    getInputProps: getAvatarInputProps,
    isDragActive: isAvatarDragActive
  } = useDropzone({
    onDrop: () => detectChange(),
    onDropAccepted: (files) => onDropAccepted(files, ImageVariant.Avatar),
    onDropRejected: (files) => onDropRejected(files, ImageVariant.Avatar),
    accept: SUPPORTED_IMAGE_FORMATS,
    maxSize: AVATAR_IMAGE_SIZE_LIMIT,
    multiple: false,
    noKeyboard: true,
    noClick: !!avatarPreviewUrl,
  });

  // Dropzone hook for Cover Image Editor
  const {
    getRootProps: getCoverRootProps,
    getInputProps: getCoverInputProps,
    open: openCoverImageFile,
    isDragActive: isCoverDragActive
  } = useDropzone({
    onDrop: () => detectChange(),
    onDropAccepted: (files) => onDropAccepted(files, ImageVariant.Cover),
    onDropRejected: (files) => onDropRejected(files, ImageVariant.Cover),
    accept: SUPPORTED_IMAGE_FORMATS,
    maxSize: COVER_IMAGE_SIZE_LIMIT,
    multiple: false,
    noClick: true,
    noKeyboard: true,
  });

  const checkKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.code === "Enter" || e.code === "NumpadEnter") e.preventDefault();
  };

  const postApi = async (data: ModalForm) => {
    try {
      let imgUrl = profile.profileImageUrl || "";
      let coverUrl = profile.bannerImageUrl || "";
      if (data.file) {
        imgUrl = await uploadImageFile(data.file[0]);
      }
      if (data.cover) {
        coverUrl = await uploadImageFile(data.cover[0]);
      }
      const newProfile: UserEntity = {
        ...profile,
        fullName: data.username,
        profileImageUrl: imgUrl,
        bannerImageUrl: coverUrl,
        email: data.email,
        bio: data.description
      };

      dispatch(userActions.updateUserProfile(newProfile)).then((data) => {
        if (!("error" in data)) {
          dispatch(participantsActions.updateOneParticipant(newProfile));
          openShareModal(newProfile, true);
          setValue("file", null);
          setValue("cover", null); 
        } else {
          setShowErrorModal(() => true);
        }
      }).catch((error) => {
        console.log("error Then", error);
      });
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const openShareModal = (userDetails: UserEntity, action: boolean) => {
    dispatch(setShowShareProfileModal({
      showModal: action,
      props: {
        url: `oceana.market/fan/${userDetails?.fullName}`,
        img: userDetails?.profileImageUrl || OceanaCoinImage().props.src,
        sharetitle: "Profile Updated!",
        customAction: true,
      }
    }));
  };

  useEffect(() => {
    if (hash === "#add-bio") {
      setFocus("description");
    }
    if (hash === "#add-username") {
      setFocus("username");
    }
  }, [hash]);

  useEffect(() => {
    setEmailErrorMessage("");
  }, [email]);

  const detectChange = () => {
    if (!edited) { setEdited(true); }
  };

  // const blocker = useBlocker(edited);

  // Reset the blocker if the user cleans the form
  // useEffect(() => {
  //   if (blocker.state === "blocked" && !edited) {
  //     blocker.reset();
  //   }
  // }, [blocker, edited]);

  const submitEditForm = () => {
    if (editFormRef?.current) {
      editFormRef.current.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
    }
  };

  useEffect(() => {
    if (secondsCountdown === null) {
      return;
    }
    else if (secondsCountdown === 0) {
      setSecondsCountdown(null);
      setSendingEmail(false);
    }
    else if (secondsCountdown <= 60) {
      const timerId = setInterval(() => {
        setSecondsCountdown(secondsCountdown - 1);
      }, 1000);
      setCounterIntervalId(timerId);
    }

    return () => clearInterval(counterIntervalId);
  }, [secondsCountdown]);

  const sendEmailConfirm = async () => {
    // validate email
    if (email) {
      setIsValidatingEmail(true);
      const { hasDuplicatedEmail }: GraphqlQuery = await apolloClient(
        ClientType.GRAPHQL,
        ApolloActionType.QUERY,
        generateHasDuplicatedEmailQuery(email)
      );
      if (hasDuplicatedEmail) {
        setEmailErrorMessage(ErrorMessages.EmailTakenError);
        setIsValidatingEmail(false);
        return;
      }
      else {
        const errorMsg = await validateEmail(email);
        if (errorMsg) {
          setEmailErrorMessage(errorMsg);
          setIsValidatingEmail(false);
          return;
        }
      }

      setIsValidatingEmail(false);

      if (secondsCountdown == null) {
        setSendingEmail(true);
        setSecondsCountdown(60);
      }
      await verifyEmailWithLogin(email);
    }
  };

  const handleCancelAvatarImage = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    clearAvatarImageErrors();
    setValue("file", null);
  };

  const handleCancelCoverImage = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    clearCoverImageErrors();
    setValue("cover", null);
  };

  return (
    <BasePage
      className="portfolio-edit-page"
      contentStyle={{ boxSizing: "border-box", width: "100%", padding: 0 }}
    >
      <ReactRouterPrompt when={edited}>
        {({ isActive, onConfirm, onCancel }) => (
          isActive && <ProceedPrompt onConfirm={onConfirm} onCancel={onCancel} actionsave={() => submitEditForm()} />
        )}
      </ReactRouterPrompt>
      <StyledFlex>
        <StyledBackButton onClose={() => window.history.back()} />
      </StyledFlex>
      <StyledFlex>
        <Left>
          <StyledForm>
            <StyledH2>
              Edit Profile
            </StyledH2>
            <form
              ref={editFormRef}
              onKeyDown={(e) => checkKeyDown(e)}
              onChange={() => detectChange()}
              onSubmit={handleSubmit(
                async (data) => {
                  try {
                    trigger();
                    setUpdating(true);

                    // START validate email
                    const { hasDuplicatedEmail }: GraphqlQuery = await apolloClient(
                      ClientType.GRAPHQL,
                      ApolloActionType.QUERY,
                      generateHasDuplicatedEmailQuery(email)
                    );
                    if (hasDuplicatedEmail) {
                      setEmailErrorMessage(ErrorMessages.EmailTakenError);
                      setUpdating(false);
                      return;
                    }
                    else {
                      const errorMsg = await validateEmail(email);
                      if (errorMsg) {
                        setEmailErrorMessage(errorMsg);
                        setUpdating(false);
                        return;
                      }
                    }
                    // END validate email

                    await postApi(data);
                    setTimeout(() => {
                      setUpdating(false);
                    }, 500);
                    setEdited(false);
                  } catch (error) {
                    console.log(error);
                  }
                },
                async (error) => {
                  console.log("handle error submit", error);
                }
              )}
            >
              {/* {edited ? <FormPrompt blocker={blocker} actionsave={() => submitEditForm()} /> : null} */}

              {/* Avatar */}
              <FormInput>
                <Flex className="gap-32 align-center">
                  <StyledCollectionFileInputContainer
                    imgSrc={avatarPreviewUrl || profile.profileImageUrl || OceanaCoinImage().props.src}
                    hasError={hasAvatarImageError}
                    isDragActive={isAvatarDragActive}
                    onMouseEnter={() => setHoveringAvatarImage(!!!avatarPreviewUrl && true)}
                    onMouseLeave={() => setHoveringAvatarImage(false)}
                    {...getAvatarRootProps()}
                  >
                    <input {...getAvatarInputProps()} />
                    <PencilOverlayWithLoader isMouseHovered={hoveringAvatarImage} rounded={true} />
                    {(avatarPreviewUrl || hasAvatarImageError) && (
                      <BorderedButton
                        iconSrc={CrossImage().props.src}
                        buttonProps={{
                          type: "button",
                          style: {
                            position: "absolute",
                            top: "-6px",
                            right: "-6px",
                            background: colors.neutrals2
                          },
                          onClick: handleCancelAvatarImage,
                        }}
                      />
                    )}
                  </StyledCollectionFileInputContainer>
                  <Flex className="flex-col gap-8">
                    <Label>Avatar</Label>
                    <Description>
                      {InfoMessages.AvatarImageDimensionInfo}
                      <br />
                      {InfoMessages.AvatarImageSizeInfo}
                    </Description>
                  </Flex>
                </Flex>
                <div>
                  {hasAvatarImageSizeError && (
                    <div className="error-message">
                      {ErrorMessages.AvatarImageSizeError}
                    </div>
                  )}
                  {hasAvatarImageDimensionError && (
                    <div className="error-message">
                      {ErrorMessages.AvatarImageDimensionError}
                    </div>
                  )}
                  {hasAvatarImageFileFormatError && (
                    <div className="error-message">
                      {ErrorMessages.ImageFormatError}
                    </div>
                  )}
                </div>
              </FormInput>

              {/* Username */}
              <FormInput>
                <Label>Username</Label>
                <ClearData data={username} clear={() => { setValue("username", ""); clearErrors("username"); detectChange(); }}>
                  <input
                    {...register("username")}
                    placeholder="Enter your username"
                    onKeyDown={(e) => {
                      if ((e.target as HTMLInputElement).value.length === 0 && e.code === "Space" || e.code === "Space") {
                        e.preventDefault();
                        e.stopPropagation();
                        return false;
                      }
                    }}
                    onChange={(e) => {
                      e.preventDefault();
                      setValue("username", e.target.value.trimStart().trim().replace(/ /g, ""));
                      if (e.target.value.trimStart().length === 0) {
                        resetField("username");
                      }
                      trigger("username");
                    }}
                    autoComplete={"off"}
                    className={`${errors.username ? "error" : ""}`}
                  />
                </ClearData>
                {Object.values(errors.username?.types || {}).map(
                  (errorMessage, i) => (
                    <div key={i as number} className="error-message">
                      {errorMessage}
                    </div>
                  )
                )}
              </FormInput>

              {/* Bio */}
              <FormInput>
                <Label>
                  Bio
                </Label>
                <ClearData data={description} clear={() => {setValue("description", ""); detectChange();}}>
                  <textarea
                    {...register("description")}
                    id="bio"
                    placeholder="Share a bit about yourself."
                    onKeyDown={(e) => {
                      if ((e.target as HTMLInputElement).value.length === 0 && e.code === "Space") {
                        e.preventDefault();
                        e.stopPropagation();
                        return false;
                      }
                    }}
                    onChange={(e) => {
                      setValue("description", e.target.value);
                      trigger("description");
                    }}
                    autoComplete={"off"}
                    className={`${errors.description ? "error" : ""}`}
                  >
                    {description}
                  </textarea>
                </ClearData>
                {Object.values(errors.description?.types || {}).map(
                  (errorMessage, i) => (
                    <div key={i as number} className="error-message">
                      {errorMessage}
                    </div>
                  )
                )}
                <BioLetterCount className={`${lengthOfDescription > 250 ? "error" : ""}`}>{lengthOfDescription} / 250</BioLetterCount>
              </FormInput>

              {/* Email */}
              <FormInput>
                <Label>Email</Label>
                <div className="relative">
                  <input
                    {...register("email")}
                    placeholder="Enter email"
                    onChange={(e) => setValue("email", e.target.value)}
                    autoComplete={"off"}
                    className={`${emailErrorMessage ? "error" : ""}`}
                    style={{ paddingRight: "86px" }}
                    disabled={sendingEmail}
                  />
                  {(!emailErrorMessage && email?.length > 0 && (
                    !profile.emailVerified ||
                    (profile.emailVerified && profile.email !== email)
                  )) && (
                    <ConfirmEmail
                      type="button"
                      onClick={sendEmailConfirm}
                      disabled={(secondsCountdown != null || isValidatingEmail) ? true : false}
                      className={(secondsCountdown != null || isValidatingEmail) ? "pending" : ""}
                    >
                      {isValidatingEmail ? "Sending" : "Confirm"}
                    </ConfirmEmail>
                  )}
                </div>
                {sendingEmail && (!profile.emailVerified || profile.email !== email) && <SendEmailInfo>
                  <p>Please check <strong>{email}</strong> to confirm your email address.</p>
                  <p>Resend email in {secondsCountdown} {(secondsCountdown && (secondsCountdown > 1)) ? "seconds" : "second"}.</p>
                </SendEmailInfo>}
                {/* Email Confirmed Status */}
                {profile?.emailVerified && profile?.email === email &&
                  <EmailVerifiedInfo>
                    <img src={greenCheckSrc} width="20" height="20" alt="Confirmed Email" /> Email Confirmed.
                  </EmailVerifiedInfo>
                }
                {/* Email Error Message */}
                {emailErrorMessage && (
                  <div className="error-message">
                    {emailErrorMessage}
                  </div>
                )}
              </FormInput>

              {/* Cover Image */}
              <FormInput>
                <Label>
                  Cover Image
                </Label>
                <StyledCoverImageUploader
                  {...getCoverRootProps()}
                  isCoverDragActive={isCoverDragActive}
                  coverPreviewUrl={coverPreviewUrl}
                  hasError={hasCoverImageError}
                  currentBannerUrl={coverPreviewUrl ? "" : profile?.bannerImageUrl}
                  onMouseEnter={() => setHoveringBannerImage(true)}
                  onMouseLeave={() => setHoveringBannerImage(false)}
                  onClick={profile?.bannerImageUrl && profile?.bannerImageUrl?.length > 0 ? openCoverImageFile : null}
                >
                  <input {...getCoverInputProps()} />

                  {(coverPreviewUrl || hasCoverImageError) ? (
                    <>
                      <BorderedButton
                        iconSrc={CrossImage().props.src}
                        buttonProps={{
                          type: "button",
                          style: {
                            position: "absolute",
                            top: "23px",
                            right: "16px",
                          },
                          onClick: handleCancelCoverImage,
                        }}
                      />
                      <img className="file-preview" src={coverPreviewUrl} alt="Preview" />
                    </>
                  ) : (
                    <>
                      {coverPreviewUrl || profile?.bannerImageUrl === "" || profile?.bannerImageUrl === null ? <>
                        <Body2Bold style={{ color: colors.neutrals4 }}>
                          {InfoMessages.CoverImageDimensionInfo}
                          <br />
                          {InfoMessages.CoverImageSizeInfo}
                        </Body2Bold>
                        <ButtonSecondarySmall type="button" onClick={openCoverImageFile}>Upload</ButtonSecondarySmall>
                      </>
                        : <>
                          {profile.address.length > 0 && <img className="current-banner" alt="Banner Image" src={profile.address.length > 0 ? (profile?.bannerImageUrl || "") : ""} />}
                          <PencilOverlayWithLoader isMouseHovered={hoveringBannerImage} rounded={false} />
                        </>
                      }
                    </>
                  )}
                </StyledCoverImageUploader>
                {((profile?.bannerImageUrl && profile?.bannerImageUrl?.length > 0) || coverPreviewUrl.length > 0) && <Body2Bold style={{ color: colors.neutrals4 }}>
                  Recommended: 1440px x 260px<br />
                  Max 15 MB in JPEG, PNG or GIF format
                </Body2Bold>}

                {/* Cover Image Errors */}
                <div>
                  {hasCoverImageSizeError && (
                    <div className="error-message">
                      {ErrorMessages.CoverImageSizeError}
                    </div>
                  )}
                  {hasCoverImageDimensionError && (
                    <div className="error-message">
                      {ErrorMessages.CoverImageDimensionError}
                    </div>
                  )}
                  {hasCoverImageFileFormatError && (
                    <div className="error-message">
                      {ErrorMessages.ImageFormatError}
                    </div>
                  )}
                </div>
              </FormInput>

              {/* Social Links */}
              {/* Commenting out until wallet connect is implemented */}
              {/* <FormInput>
                <Socials />
              </FormInput> */}

              <hr />

              {/* Action */}
              <FormInput style={{ alignItems: "end", display: "flex", marginBottom: "128px" }}>
                {updating ? (
                  <ButtonPrimary disabled={true}>Saving ...</ButtonPrimary>
                ) : (
                  <>
                    {showErrorModal ? <>
                      <ConnectedStatus className="error">
                        <ErrorIconImage />
                        {"Uh-oh, we had a little hiccup and couldn't save your profile!"}
                      </ConnectedStatus>
                      <SaveProfileButton className="error" type="submit" disabled={hasErrors}>Retry Save</SaveProfileButton>
                    </> : <SaveProfileButton type="submit" disabled={hasErrors}>Save Profile</SaveProfileButton>}
                  </>
                )}
              </FormInput>
            </form>
          </StyledForm>
        </Left>

        {/* Verification Status Module */}
        <Right>
          <Verified verified={!!profile?.isVerified} />
        </Right>

      </StyledFlex>
    </BasePage>
  );
};

const ConnectedStatus = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px 24px;
  gap: 16px;
  background: rgba(63, 140, 255, 0.08);
  border-radius: 10px;
  margin-bottom: 12px;
  margin-top: 12px;
  
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 20px;
  color: #7FBA7A;
  width: 100%;
  &.error {
    background: rgba(255, 162, 192, 0.08);
    color: #FFA2C0;
  }
`;

const StyledCollectionFileInputContainer = styled.div`
  position: relative;
  width: 128px;
  height: 128px;
  min-width: 128px;
  background-image: url("${(props: any) => props.imgSrc}");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  box-shadow: ${(props: any) => props.hasError ? "inset 0 0 0 3px #ffa2c0" : ""};
  border-radius: 100%;
  border-style: ${(props: any) => props.isAvatarDragActive ? "dashed" : "none"};
  border-color: ${colors.primaryBlue};
  border-width: 2px;
`;
const BioLetterCount = styled.div`
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  display: flex;
  align-items: center;
  text-align: center;
  color: #808191;
  &.error {
    color: #ffa2c0;
  }
`;

const SaveProfileButton = styled(ButtonPrimary)`
  &.error {
    background-color: #ffa2c0;
    color: #1F2128;
    &:hover {
      background-color: rgba(255,162,192,0.7);
    }
  }
  @media (max-width: ${RESPONSIVE.small}) {
    width: 100%;
  }
`;

const StyledH2 = styled(H2)`
  @media (max-width: ${RESPONSIVE.small}) {
    font-size: 32px;
    line-height: 40px;
  }
`;
const EmailVerifiedInfo = styled.div`
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
  display: flex;
  align-items: center;
  text-align: center;
  color: #7FBA7A;
  gap: 8px;
`;

const SendEmailInfo = styled.div`
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
  display: flex;
  align-items: center;
  text-align: left;
  color: #B1B5C4;
  flex-direction: column;
  gap: 6px;
  align-items: flex-start;
  strong {
    font-weight: 600;
  }
`;

const ConfirmEmail = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);

  font-family: 'DM Sans';
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 16px;
  text-align: center;
  color: #3F8CFF;
  &.pending {
    color: #808191;
  }
`;

const StyledBackButton = styled(BackButton)`
  margin-top: 36px;
  @media (max-width: 850px) {
    margin-top: 4px;
  }
`;

const Description = styled.div`
  text-align: left;
  font-family: "Poppins";
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: #808191;
`;

const FormInput = styled.div`
  display: flex;
  gap: 12px;
  flex-direction: column;
  .react-tooltip-clickable-link {
    a {
      color: #3F8CFF !important;
    }
    pointer-events: auto !important;
  }
  .file-selected {
    position: relative;
    .bordered-button {
      position: absolute;
      background: #242731;
    }
  }
`;

const Label = styled.label`
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-size: 24px;
  line-height: 32px;
  color: #FCFCFD;
`;

const StyledFlex = styled(Flex)`
  gap: 48px;
  padding-top: 60px;
  padding-left: 76px;
  padding-right: 76px;
  max-width: 1120px;
  margin: auto;

  display: grid;
  grid-template-columns: 256px 1fr;
  grid-template-rows: auto 1fr;
  column-gap: 128px;

  .file-input .placeholder {
    font-size: 16px;
  }

  @media (max-width: 1024px) {
    column-gap: 40px;
  }
  @media (max-width: 1023px) {
    padding-left: 76px;
    padding-right: 76px;
  }
  /* @media (max-width: 850px) {
    grid-template-columns: 200px 1fr;
  }*/
  @media (max-width: 850px) {
    flex-direction: column;
    grid-template-columns: 1fr;
  }
  @media (max-width: 767px) {
    padding-left: 24px;
    padding-right: 24px;
  }
  @media (max-width: 375px) {
    padding-left: 24px;
    padding-right: 24px;
  }
  @media (max-width: 320px) {
    padding-left: 4px;
    padding-right: 4px;
  }
`;

const Left = styled.div`
  flex: 1;
  min-width: 0;
  @media (max-width: 850px) {
    order: 1;
  }
`;
const Right = styled.div`
  flex: 0 0 352px;
  @media (max-width: 850px) {
    flex: 0;
  }
`;
const StyledForm = styled.div`
  display: flex;
  gap: 48px;
  flex-direction: column;
`;
const StyledCoverImageUploader = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
  padding: ${(props: any) => props.coverPreviewUrl ? "23px 16px" : "48px 16px"};
  border: ${(props: any) => props.isCoverDragActive ? "2px dashed" : "none"};
  border-color: ${colors.primaryBlue};
  box-shadow: ${(props: any) => props.hasError ? "inset 0 0 0 3px #ffa2c0" : ""};
  background: rgba(63, 140, 255, 0.08);
  background-color: ${colors.neutrals2};
  background-image: url(${(props: { currentBannerUrl: string; }) => props.currentBannerUrl});
  background-size: cover;
  background-position: center;
  border-radius: 16px;
  overflow: hidden;
  text-align: center;
  padding: ${(props: { currentBannerUrl: string; }) => props?.currentBannerUrl?.length > 0 ? "0" : "inherit"};
  min-height: 200px;
  .file-preview {
    margin: auto;
    max-height: 385px;
    width: calc(80% - 31px);
    object-fit: contain;
    background-color: ${(props: any) => props.coverPreviewUrl ? "#fcfcfd" : "transparent"};
  }
  .current-banner {
    border-radius: 16px;
    height: 200px;
    width: 100%;
    object-fit: cover;
  }
`;

export default PortfolioEditPage;
