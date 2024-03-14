import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useMemo, useState } from "react";
import { ErrorCode, FileRejection, useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styled from "styled-components";
import * as Yup from "yup";
import StringSchema from "yup/lib/string";

import { Query as GraphqlQuery, UserEntity } from "../../../../generated-graphql/graphql";
import { uploadImageFile } from "../../../api/upload";
import { ApolloActionType, ClientType, apolloClient } from "../../../core/clients/apolloClient";
import greenCheckSrc from "../../../assets/images/green-check.svg";
import { AVATAR_IMAGE_SIZE_LIMIT, SUPPORTED_IMAGE_FORMATS } from "../../../core/constants/base.const";
import { ErrorMessages } from "../../../core/constants/messages.const";
import { RESPONSIVE } from "../../../core/constants/responsive.const";
import { colors } from "../../../core/constants/styleguide.const";
import { ImageVariant } from "../../../core/enums/image-variant.enum";
import { League } from "../../../core/enums/league.enum";
import { generateHasDuplicatedFullNameQuery } from "../../../core/graphql-queries/backend-queries/duplication-check.query";
import { useAppDispatch, useAppSelector } from "../../../core/hooks/rtkHooks";
import { useWatchResize } from "../../../core/hooks/useWatchResize";
import { setShowPlanktonModalAction, setShowShareProfileModal } from "../../../core/store/slices/modalSlice";
import * as participantsActions from "../../../core/store/slices/participantsSlice";
import * as userActions from "../../../core/store/slices/userSlice";
import { isValidImageDimension } from "../../../core/util/image.util";
import { LeagueLib } from "../../../core/util/league.util";
import { getLocalStorageWithExpiry, setLocalStorageWithExpiry } from "../../../core/util/localstorage.util";
import { pixelToNumber } from "../../../core/util/string.util";
import { CrossImage, ImagePlaceholderImage, OceanaCoinImage, WrongImagePlaceholderImage } from "../../assets/app-images/AppImages";
import BackButton from "../../button/back-button/BackButton";
import BorderedButton from "../../button/bordered-button/BorderedButton";
import ModalCloseButton from "../../button/modal-close-button/ModalCloseButton";
import PencilOverlayWithLoader from "../../image/pencil-overlay-with-loader/PencilOverlayWithLoader";
import ClearData from "../../input/clear-data/ClearData";
import { Block, Body2Bold, ButtonPrimary, ButtonSecondary } from "../../styleguide/styleguide";
import Modal from "../Modal";
import ModalContent from "../children/modal-content/ModalContent";
import "./plankton-modal.scss";

type ModalForm = {
  username: string;
  file: FileList | null;
};

const STRING_SPECIAL_PATTERN = /^(?=.*[a-zA-Z])[A-Za-z0-9\D\M]+$/;

const PlanktonModal = () => {
  const dispatch = useAppDispatch();
  const { windowWidth } = useWatchResize();

  const { profile, league } = useAppSelector(state => state.user);
  // const { participantsData } = useAppSelector(state => state.participants);

  const [updating, setUpdating] = useState(false);
  const [updated, setUpdated] = useState(false);

  // image
  const [hoveringImage, setHoveringImage] = useState(false);
  const [hasImageDimensionError, setHasImageDimensionError] = useState(false);
  const [hasImageSizeError, setHasImageSizeError] = useState(false);
  const [hasImageFileFormatError, setHasImageFileFormatError] = useState(false);

  const [hasNextStep, setHasNextStep] = useState(getLocalStorageWithExpiry("hasNextStep"));
  const [hideLevelUp, setHideLevelUp] = useState(sessionStorage.getItem("hideLevelUp"));

  const hasImageError = hasImageDimensionError || hasImageFileFormatError || hasImageSizeError;

  const clearImageErrors = () => {
    setHasImageDimensionError(false);
    setHasImageSizeError(false);
    setHasImageFileFormatError(false);
  };

  const yupValidationSchema: Yup.ObjectSchema<{
    username: StringSchema<string | undefined>;
  }> = Yup.object().shape({
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
  });

  const {
    register,
    handleSubmit,
    setValue,
    resetField,
    watch,
    trigger,
    formState: { errors }
  } = useForm<ModalForm>({
    resolver: yupResolver(yupValidationSchema),
    criteriaMode: "all",
    defaultValues: {}
  });

  const username = watch("username");
  const fileList = watch("file");
  const hasErrors = Object.keys(errors).length > 0 || hasImageError;
  const avatarPreviewUrl = useMemo(() => {
    return hasImageFileFormatError ? WrongImagePlaceholderImage().props.src
      : hasImageDimensionError || hasImageSizeError ? ImagePlaceholderImage().props.src
        : fileList?.item(0) ? URL.createObjectURL(fileList.item(0) as File) : "";
  }, [hasImageFileFormatError, hasImageDimensionError, hasImageSizeError, fileList]);

  // callback functions for useDropzone hook
  const onDropAccepted = async (acceptedFiles: File[]) => {
    if (acceptedFiles?.length > 0) {
      const imgUrl = URL.createObjectURL(acceptedFiles[0]);
      if (!(await isValidImageDimension(imgUrl, ImageVariant.Avatar))) {
        setHasImageDimensionError(true);
      }
      const dataTransfer = new DataTransfer();
      acceptedFiles.map(file => dataTransfer.items.add(file));
      setValue("file", dataTransfer.files);
    }
  };
  const onDropRejected = async (fileRejections: FileRejection[]) => {
    clearImageErrors();

    if (fileRejections) {
      const dataTransfer = new DataTransfer();
      const imgUrl = URL.createObjectURL(fileRejections[0].file);

      // check image dimension
      try {
        if (!(await isValidImageDimension(imgUrl, ImageVariant.Avatar))) {
          setHasImageDimensionError(true);
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
            setHasImageSizeError(true);
          }
          else if (error.code === ErrorCode.FileInvalidType) {
            setHasImageFileFormatError(true);
          }
        });
      });
      setValue("file", dataTransfer.files);
    }
  };

  // Dropzone hook for Avatar Image Editor
  const {
    getRootProps,
    getInputProps,
    isDragActive
  } = useDropzone({
    onDropAccepted,
    onDropRejected,
    accept: SUPPORTED_IMAGE_FORMATS,
    maxSize: AVATAR_IMAGE_SIZE_LIMIT,
    multiple: false,
    noKeyboard: true,
    noClick: !!avatarPreviewUrl
  });

  const onClose = () => {
    localStorage.setItem("leaguemodal", "false");
    setLocalStorageWithExpiry("hasNextStep", "true", 43200000);
    sessionStorage.setItem("hideLevelUp", "true");
    dispatch(setShowPlanktonModalAction(false));
  };

  const checkKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.code === "Enter" || e.code === "NumpadEnter") e.preventDefault();
  };

  const postApi = async (data: any) => {
    try {
      let newProfileImageUrl = profile.profileImageUrl;

      if (data?.file) {
        newProfileImageUrl = await uploadImageFile(data.file[0]);
      }

      const newProfile: UserEntity = {
        ...profile,
        fullName: data.username || "",
        profileImageUrl: newProfileImageUrl || "",
        hasNextStep: false,
      };

      dispatch(userActions.updateUserProfile(newProfile));
      dispatch(participantsActions.updateOneParticipant(newProfile));
      setValue("file", null);
      setUpdated(true);
      sessionStorage.removeItem("hideLevelUp");
      localStorage.removeItem("hasNextStep");
      // sessionStorage.removeItem("hasNextStep");
      setHasNextStep("false");
      setTimeout(() => {
        setUpdated(false);
      }, 5000);
    } catch (error) { }
  };

  const onSubmit = async (data: ModalForm) => {
    try {
      trigger();
      setUpdating(true);
      await postApi(data);
      setTimeout(() => {
        setUpdating(false);
      }, 5000);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setValue("username", profile?.fullName as string);
    setHasNextStep(getLocalStorageWithExpiry("hasNextStep"));
    setHideLevelUp(sessionStorage.getItem("hideLevelUp"));
  }, []);

  // useEffect(() => {
  //   if (league === League.Shrimp) {
  //     dispatch(setShowShrimpModalAction(true));
  //     dispatch(setShowPlanktonModalAction(false));
  //   }
  //   if (league === League.Crab) {
  //     dispatch(setShowCrabModalAction(true));
  //     dispatch(setShowPlanktonModalAction(false));
  //   }
  // }, [league]);

  useEffect(() => {
    setValue("username", profile.fullName && profile.fullName !== "null" ? profile.fullName : "");
  }, [profile.fullName]);

  const liquidUsername = (profile.fullName || "" as string).toLowerCase() === (username || "" as string).toLowerCase();

  let ifLiquidChange = true;

  if (fileList) {
    ifLiquidChange = false;
  }
  if (!liquidUsername) {
    ifLiquidChange = false;
  }

  const postNextStep = async (data: boolean) => {
    sessionStorage.setItem("hideLevelUp", "true");
    setLocalStorageWithExpiry("hasNextStep", "true", 43200000);
    setHasNextStep("true");
    setHideLevelUp("true");
  };

  const titleDescription = useMemo(() => {
    // Set TITLE and then DESCRIPTION using one useMemo
    if (hasNextStep === "true") {
      return [LeagueLib[league].reportTitle[1], LeagueLib[league].reportDescription[1]];
    } else {
      return [LeagueLib[league].reportTitle[0], LeagueLib[league].reportDescription[0]];
    }
  }, [hasNextStep, league]);

  return (
    <Modal>
      <StyledModalContent className="plankton-modal">
        <>
          {windowWidth <= pixelToNumber(RESPONSIVE.mobile) && (
            <>
              <BackButton onClose={onClose} />
              <Block className="h-32" />
            </>
          )}
          {windowWidth > pixelToNumber(RESPONSIVE.mobile) && (
            <Flex className="justify-between align-center">
              <ModalCloseButton onClose={onClose} />
            </Flex>
          )}

          {/* Thumbnail */}
          <Thumbnail>
            {LeagueLib[league].image}
          </Thumbnail>

          {/* Title */}
          <h2 style={{ display: "flex" }}>
            <span className="report-title">
              <ReactMarkdown linkTarget="_blank" remarkPlugins={[remarkGfm]}>{titleDescription[0]}</ReactMarkdown>
            </span>
          </h2>

          {/* Description */}
          <div className="report-desc text-center">
            <ReactMarkdown linkTarget="_blank" remarkPlugins={[remarkGfm]}>{titleDescription[1]}</ReactMarkdown>
          </div>

          {/* OK button */}
          {league !== League.Microbe ? (
            <div className="content">
              <ButtonPrimary onClick={() => {
                dispatch(setShowShareProfileModal({
                  showModal: true,
                  props: {
                    url: window.location.href,
                    img: profile?.profileImageUrl || OceanaCoinImage().props.src
                  }
                }));
                onClose();
              }}>
                Share Your Progress
              </ButtonPrimary>
            </div>
          ) : (
            <>
              {hideLevelUp == null ? (
                <div className="content">
                  <StyledContentInner style={{ marginBottom: "40px" }}>
                    <Flex className="flex-col gap-12">
                      <ButtonPrimary className="w-full" onClick={() => postNextStep(true)}>
                        {"Let's do it!"}
                      </ButtonPrimary>
                      <ButtonSecondary className="w-full" onClick={onClose}>
                        Not Now
                      </ButtonSecondary>
                    </Flex>
                  </StyledContentInner>
                </div>
              ) : (
                <form
                  onKeyDown={(e) => checkKeyDown(e)}
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <div className="content">
                    <StyledContentInner className="text-left">
                      <Flex className="gap-20 align-center">
                        <StyledCollectionFileInputContainer
                          imgSrc={avatarPreviewUrl || profile.profileImageUrl || OceanaCoinImage().props.src}
                          hasError={hasImageError}
                          isDragActive={isDragActive}
                          onMouseEnter={() => setHoveringImage(!!!avatarPreviewUrl && true)}
                          onMouseLeave={() => setHoveringImage(false)}
                          {...getRootProps()}
                        >
                          <input {...getInputProps()} />
                          <PencilOverlayWithLoader isMouseHovered={hoveringImage} rounded={true} />
                          {(avatarPreviewUrl || hasImageError) && (
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
                                onClick: (e) => {
                                  e.stopPropagation();
                                  clearImageErrors();
                                  setValue("file", null);
                                },
                              }}
                            />
                          )}
                        </StyledCollectionFileInputContainer>
                        <div>
                          <Avatar>Avatar</Avatar>
                          <Description>
                            Minimum: 400px x 400px
                            <br />
                            Max 5 MB in JPEG, PNG or GIF format
                          </Description>
                        </div>
                      </Flex>
                      <div>
                        {hasImageDimensionError && (
                          <div className="error-message">
                            <div>{ErrorMessages.AvatarImageDimensionError}</div>
                          </div>
                        )}
                        {hasImageSizeError && (
                          <div className="error-message">
                            <div>{ErrorMessages.AvatarImageSizeError}</div>
                          </div>
                        )}
                        {hasImageFileFormatError && (
                          <div className="error-message">
                            <div>{ErrorMessages.ImageFormatError}</div>
                          </div>
                        )}
                      </div>
                    </StyledContentInner>
                    <StyledContentInner>
                      <Body2Bold className="font-neutrals8">Username</Body2Bold>
                      <ClearData
                        data={username}
                        clear={() => {
                          resetField("username");
                          setTimeout(() => {
                            trigger("username");
                          }, 500);
                        }}
                      >
                        <>
                          <StyledAtIcon>@</StyledAtIcon>
                          <input
                            autoComplete="off"
                            type="text"
                            placeholder={`Your Username`}
                            {...register("username")}
                            onChange={(e) => {
                              e.preventDefault();
                              setValue("username", e.target.value.trimStart().trim());
                              if (e.target.value.trimStart().length === 0) {
                                resetField("username");
                              }
                              trigger("username");
                            }}
                            className={`${errors.username ? "error" : ""}`}
                          />
                        </>
                      </ClearData>
                      {Object.values(errors.username?.types || {}).map(
                        (errorMessage, i) => (
                          <div key={i} className="error-message">
                            {errorMessage}
                          </div>
                        )
                      )}
                    </StyledContentInner>
                    {updated && <ConnectedStatus>
                      <img height="24" src={greenCheckSrc} alt="Check" />
                      <span>Your profile was updated.</span>
                    </ConnectedStatus>}
                    <StyledContentInner>
                      <Flex className="flex-col gap-8">
                        <ButtonPrimary className="w-full" disabled={updating || ifLiquidChange ? true : hasErrors}>
                          {updating ? "Saving ..." : "Save"}
                        </ButtonPrimary>
                        <ButtonSecondary className="w-full" onClick={onClose}>
                          Cancel
                        </ButtonSecondary>
                      </Flex>
                    </StyledContentInner>
                  </div>
                </form>
              )}
            </>
          )}
        </>
      </StyledModalContent>
    </Modal>
  );
};

const ModalLoader = styled.div`
  margin-bottom: 64px;
  justify-content: center;
  text-align: center;
  align-items: center;
  margin-top: 64px;
  display: flex;
`;

const ConnectedStatus = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px 24px;
  gap: 16px;
  background: rgba(63, 140, 255, 0.08);
  border-radius: 10px;
  margin-bottom: 0;
  margin-top: 0;
  
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 20px;
  color: #7FBA7A;
`;

const Thumbnail = styled.div`
  display: flex;
  border-radius: 100%;
  background: rgba(63, 140, 255, 0.08);
  justify-content: center;
  align-items: center;
  width: 128px;
  height: 128px;
  margin: auto;
  margin-bottom: 32px;
  img {
    width: 116px;
  }
`;
const StyledContentInner = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
const StyledAtIcon = styled.div`
  font-family: "Poppins";
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  position: absolute;
  color: #fcfcfd;
  left: 16px;
  top: calc(50% - 2px);
  transform: translateY(-50%);
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
`;

const Avatar = styled.div`
  font-family: "Poppins";
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: #fcfcfd;
`;

const Description = styled.div`
  text-align: left;
  font-family: "Poppins";
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;
  color: #808191;
`;

const StyledModalContent = styled(ModalContent)`
  input {
    transition: all 0.2s ease;
    border: 2px solid #353945;
    border-radius: 12px;
    padding: 12px 16px;
    display: block;
    background-color: transparent;
    width: 100%;
    box-sizing: border-box;
    color: #fcfcfd;
    line-height: 24px;
    font-family: poppins;

    padding-left: 34px;

    font-size: 16px;
    font-weight: 500;
    &::placeholder {
      color: #808191;
      font-weight: 400 !important;
    }
    &:hover {
      border-color: #808191;
    }
    &:focus {
      border-color: #3f8cff;
    }
  }

  input::placeholder {
    color: #808191;
    font-weight: 400;
  }

  input {
    font-weight: 400;
  }

  input.error {
    border-color: #ffa2c0;
  }
  .content {
    margin-top: 32px;
  }
  .report-desc {
    margin-top: 6px;
    a {
      color: #3F8CFF;
      &:hover {
        color: #FCFCFD !important;
      }
    }
  }
  @media screen and (max-width: ${RESPONSIVE.small}) {
    max-width: 100% !important;
    border-radius: 0 !important;
    padding: 32px 24px !important;
    height: 100vh;
  }
`;

const StyledCollectionFileInputContainer = styled.div`
  position: relative;
  width: 84px;
  height: 84px;
  flex: 0 0 84px;
  background-image: url("${(props: any) => props.imgSrc}");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  box-shadow: ${(props: any) => props.hasError ? "inset 0 0 0 3px #ffa2c0" : ""};
  border-radius: 100%;
  border-style: ${(props: any) => props.isDragActive ? "dashed" : "none"};
  border-color: ${colors.primaryBlue};
  border-width: 2px;
`;

export default PlanktonModal;
