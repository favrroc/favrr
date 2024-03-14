import React, { useMemo, useState } from "react";
import { ErrorCode, FileRejection, useDropzone } from "react-dropzone";
import { Link } from "react-router-dom";
import styled from "styled-components";

import BasePage from "../base-page/BasePage";
// import NewsList from "../../components/news/news-list/NewsList";
import { PencilImage } from "../../components/assets/app-images/AppImages";
import PencilOverlayWithLoader from "../../components/image/pencil-overlay-with-loader/PencilOverlayWithLoader";
import UploadImageModal from "../../components/modal/UploadImageModal";
import MyOrdersPanel from "../../components/orders/my-orders-panel/MyOrdersPanel";
import FollowTab from "../../components/portfolio/FollowTab";
import PortoflioTab from "../../components/portfolio/Portfolio-tab";
import UserModule from "../../components/portfolio/User-Module";
import { Block, ButtonSecondary, Flex } from "../../components/styleguide/styleguide";
import { COVER_IMAGE_SIZE_LIMIT, SUPPORTED_IMAGE_FORMATS } from "../../core/constants/base.const";
import { ImageVariant } from "../../core/enums/image-variant.enum";
import { useAppDispatch, useAppSelector } from "../../core/hooks/rtkHooks";
import { ParticipantInfo } from "../../core/store/slices/participantsSlice";
import { updateUserImagesFromFile } from "../../core/store/slices/userSlice";
import { isValidImageDimension } from "../../core/util/image.util";
import { portfolioEditPath } from "../../core/util/pathBuilder.util";
import "./portfolio-page.scss";

const PortfolioPage = () => {
  const dispatch = useAppDispatch();

  const { profile } = useAppSelector(state => state.user);
  const { loadingParticipantsData, participantsData } = useAppSelector(state => state.participants);

  const [hoveringBannerImage, setHoveringBannerImage] = useState(false);
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [showUploadImageModal, setShowUploadImageModal] = useState(false);
  const [hasImageDimensionError, setHasImageDimensionError] = useState(false);
  const [hasImageSizeError, setHasImageSizeError] = useState(false);
  const [hasImageFileFormatError, setHasImageFileFormatError] = useState(false);
  const [uploadingBannerImage, setUploadingBannerImage] = useState(false);
  const clearImageErrors = () => {
    setHasImageDimensionError(false);
    setHasImageSizeError(false);
    setHasImageFileFormatError(false);
  };

  const onDropAccepted = async (acceptedFiles: File[]) => {
    if (acceptedFiles?.length > 0) {
      const coverUrl = URL.createObjectURL(acceptedFiles[0]);
      if (!(await isValidImageDimension(coverUrl, ImageVariant.Cover))) {
        setHasImageDimensionError(true);
      }
      else {
        setUploadingBannerImage(true);
        await dispatch(updateUserImagesFromFile({ bannerImageFile: acceptedFiles[0] }));
        setUploadingBannerImage(false);
        setShowUploadImageModal(false);
      }
    }
  };
  const onDropRejected = async (fileRejections: FileRejection[]) => {
    clearImageErrors();

    if (fileRejections) {
      const coverUrl = URL.createObjectURL(fileRejections[0].file);

      // check image dimension
      try {
        if (!(await isValidImageDimension(coverUrl, ImageVariant.Cover))) {
          setHasImageDimensionError(true);
        }
      }
      catch (e) {
        console.log(e);
      }

      // check file size and format
      fileRejections.map(fileRejection => {
        fileRejection.errors.map(error => {
          if (error.code === ErrorCode.FileTooLarge) {
            setHasImageSizeError(true);
          }
          else if (error.code === ErrorCode.FileInvalidType) {
            setHasImageFileFormatError(true);
          }
        });
      });
    }
  };
  const { getRootProps, getInputProps, open } = useDropzone({
    onDropAccepted,
    onDropRejected,
    accept: SUPPORTED_IMAGE_FORMATS,
    maxSize: COVER_IMAGE_SIZE_LIMIT,
    multiple: false,
    noClick: true,
    noDrag: true,
    noKeyboard: true,
  });

  const handleClickBannerImage = () => {
    clearImageErrors();
    setShowUploadImageModal(true);
  };

  const followingsData: Array<ParticipantInfo> = useMemo(() => {
    return participantsData.filter(data => data.isFollowing).sort((a, b) => b.equity - a.equity);
  }, [loadingParticipantsData, participantsData]);

  const followersData: Array<ParticipantInfo> = useMemo(() => {
    return participantsData.filter(data => data.isFollower).sort((a, b) => b.equity - a.equity);
  }, [loadingParticipantsData, participantsData]);

  // useEffect(() => {
  //   const x = async () => {

  //     if(profile.address) {
  //       console.log("profile.address", profile.address);
  //       await dispatch(loadFollowersAddress(profile.address));
  //       await dispatch(loadFollowingsAddress(profile.address));
  //     }
  //   };
  //   x();
  // }, [profile]);

  return (
    <BasePage contentStyle={{ boxSizing: "border-box", width: "100%", padding: 0 }}>
      <Block
        onMouseEnter={() => setHoveringBannerImage(true)}
        onMouseLeave={() => setHoveringBannerImage(false)}
      >
        <Banner coverimg={profile?.bannerImageUrl || ""} {...getRootProps()} onClick={handleClickBannerImage}>
          <input {...getInputProps()} />
          <PencilOverlayWithLoader isMouseHovered={hoveringBannerImage} uploading={uploadingBannerImage} />
          <BannerInner>
            <Link to={portfolioEditPath()} onClick={e => e.stopPropagation()}>
              <StyledButtonSecondary>
                <span className="hide-s">Edit Profile</span>
                <span className="show-s">Edit</span>
                <PencilImage size="small" />
              </StyledButtonSecondary>
            </Link>
          </BannerInner>
        </Banner>
      </Block>
      <StyledFlex>
        <Left>
          <UserModule />
        </Left>
        <Right>
          <Tabs>
            <Tab className={`${currentTab === 0 ? "active" : ""}`} onClick={() => setCurrentTab(0)}>Portfolio</Tab>
            <Tab className={`${currentTab === 1 ? "active" : ""}`} onClick={() => setCurrentTab(1)}>Following</Tab>
            <Tab className={`${currentTab === 2 ? "active" : ""}`} onClick={() => setCurrentTab(2)}>Followers</Tab>
            <Tab className={`${currentTab === 3 ? "active" : ""}`} onClick={() => setCurrentTab(3)}>Activity</Tab>
          </Tabs>
          <TabBlocks>
            {currentTab === 0 && <Block>
              <PortoflioTab />
            </Block>}

            {currentTab === 1 && (
              <Block>
                <FollowTab
                  isFollowingTab={true}
                  data={followingsData}
                />
              </Block>
            )}

            {currentTab === 2 && <Block>
              <FollowTab
                isFollowingTab={false}
                data={followersData}
              />
            </Block>}

            {currentTab === 3 && <Block>
              <MyOrdersPanel />
            </Block>}
          </TabBlocks>
        </Right>
      </StyledFlex>
      {showUploadImageModal && (
        <UploadImageModal
          imageVariant={ImageVariant.Cover}
          onOpenFile={() => {
            clearImageErrors();
            open();
          }}
          onClose={() => setShowUploadImageModal(false)}
          hasImageDimensionError={hasImageDimensionError}
          hasImageSizeError={hasImageSizeError}
          hasImageFileFormatError={hasImageFileFormatError}
          uploading={uploadingBannerImage}
        />
      )}
    </BasePage>
  );
};

const StyledButtonSecondary = styled(ButtonSecondary)`
  background-color: #1F2128;
  box-shadow: inset 0 0 0 2px #808191;
  padding: 0px 16px;
  font-size: 14px;
  height: 40px;
  .show-s {
    display: none;
  }
  @media screen and (max-width: 576px) {
    margin-bottom: 104px;
    .hide-s {
      display: none;
    }
    .show-s {
      display: block;
    }
  }
`;
const Tabs = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 12px;
  position: sticky;
  top: 82px;
  padding: 16px 0;
  background: #1F2128;
  z-index: 1;
  margin-bottom: 32px;
  &::-webkit-scrollbar {
    display: none;
  }
`;
const Tab = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 6px 12px;
  gap: 10px;
  height: 28px;
  border-radius: 100px;
  background: none;

  font-family: 'DM Sans';
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 16px;
  display: flex;
  align-items: center;
  color: #777E91;
  &:hover {
    color: #FCFCFD;
  }
  &.active {
    color: #23262F;
    background: #E6E8EC;
  }
`;
const TabBlocks = styled.div`
  margin-bottom: 250px;
  @media screen and (max-width: 576px) {
    margin-bottom: 64px;
  }
`;

const Banner = styled.div`
  position: relative;
  height: 326px;
  display: flex;
  justify-content: center;
  padding-bottom: 32px;
  cursor: pointer;
  background: #15171C url(${(props: any) => props.coverimg}) no-repeat center;
  background-size: cover;
  @media screen and (max-width: 1024px) {
    height: 297px;
  }
  @media screen and (max-width: 576px) {
    height: 271px;
  }
`;

const BannerInner = styled.div`
  z-index: 2;
  padding-top: 0;
  padding-left: 76px;
  padding-right: 76px;
  max-width: 1120px;
  width: 100%;
  align-items: end;
  justify-content: end;
  display: flex;
  @media (max-width: 1023px) {
    padding-left: 76px;
    padding-right: 76px;
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

const StyledFlex = styled(Flex)`
  gap: 48px;
  padding-top: 67px;
  padding-left: 76px;
  padding-right: 76px;
  max-width: 1120px;
  margin: auto;

  display: grid;
  grid-template-columns: 256px 1fr;
  grid-template-rows: auto 1fr;
  column-gap: 64px;

  @media (max-width: 1024px) {
    column-gap: 48px;
  }
  @media (max-width: 1023px) {
    padding-left: 76px;
    padding-right: 76px;
  }
  @media (max-width: 850px) {
    grid-template-columns: 200px 1fr;
  }
  @media (max-width: 767px) {
    padding-left: 24px;
    padding-right: 24px;
  }
  @media (max-width: 576px) {
    flex-direction: column;
    grid-template-columns: 1fr;
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
  flex: 0 0 256px;
`;
const Right = styled.div`
  flex: 1;
  min-width: 0;
`;

export default PortfolioPage;
