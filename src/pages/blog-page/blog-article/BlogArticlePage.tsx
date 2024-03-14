import React, { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";

import CopyToClipboard from "react-copy-to-clipboard";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { useNavigate, useParams } from "react-router-dom";
import { EmailShareButton, FacebookShareButton, LinkedinShareButton, TwitterShareButton } from "react-share";
import Sticky from "react-stickynode";
import BlogRelated from "../../../components/blog/BlogRelated";
import Author from "../../../components/blog/author/Author";
import BackButton from "../../../components/button/back-button/BackButton";
import SEO from "../../../components/seo/SEO";
import { ContainerBox } from "../../../components/styleguide/styleguide";
import { blogs } from "../../../core/constants/blogs.const";
import { RESPONSIVE } from "../../../core/constants/responsive.const";
import { blogPath, notFoundPath } from "../../../core/util/pathBuilder.util";
import BasePage from "../../base-page/BasePage";
import "./blog-article-page.scss";

import chainSrc from "../../../assets/images/chain.svg";
import emailSrc from "../../../assets/images/icon-email.svg";
import facebookSrc from "../../../assets/images/social-icons/icon-facebook.svg";
import linkedinSrc from "../../../assets/images/social-icons/icon-linkedin.svg";
import twitterSrc from "../../../assets/images/social-icons/icon-twitter.svg";
import { useWatchResize } from "../../../core/hooks/useWatchResize";

const BlogArticlePage = () => {
  const navigate = useNavigate();
  const { windowWidth } = useWatchResize();

  const { title } = useParams<{ title: string; }>();
  const blogData: any | undefined = useMemo(() => {
    for (const blog of blogs) {
      if (blog.url === title) {
        return blog;
      }
    }
    return false;
  }, [title]);

  useEffect(() => {
    if (!blogData) navigate(notFoundPath());
  }, [blogData]);

  const [actionMessage, setActionMessage] = useState<boolean>(false);

  const toggleCopied = () => {
    setActionMessage(true);
    setTimeout(() => setActionMessage(false), 1000);
  };

  const shareTitle = "Check out this blog post on Oceana";

  const bodyContentRef = useRef<any>();
  const [stickyBoundary, setStickyBoundary] = useState<number>(0);

  useEffect(() => {
    setTimeout(() => {
      setStickyBoundary(bodyContentRef?.current?.offsetHeight + bodyContentRef?.current?.offsetTop - 400);
    }, 1000);
  }, [bodyContentRef, bodyContentRef?.current?.offsetHeight, windowWidth, title]);

  return (
    <BasePage
      className="blog-article"
    >
      <SEO
        title={`${blogData?.heading}`}
        description={`Oceana Blog Article`}
        name={`Oceana Market`}
        type={`Blog Page`}
      />
      <ContainerBox>
        <StyledPaddingContainer style={{ paddingTop: 0 }}>
          <StyledBackButton>
            <BackButton dark={false} onClose={() => navigate(blogPath())} />
          </StyledBackButton>
        </StyledPaddingContainer>
        <StyledPaddingContainer>
          <Headline>
            <h1>
              {blogData?.heading}
            </h1>
            <Author detail={blogData.detail} showDetail={false} />
          </Headline>
          <Img src={blogData?.banner} />
        </StyledPaddingContainer>
        <div className="sticky-boundary-box">
          <StyledPaddingContainer style={{ position: "relative", padding: 0 }}>
            <Sticky top={108} bottomBoundary={stickyBoundary} enabled={windowWidth > 768 ? true : false}>
              <Share className="share-button">
                <FacebookShareButton
                  quote={shareTitle}
                  url={`${window.location.href}`}
                >
                  <img src={facebookSrc} alt="Facebook Share Link" />
                </FacebookShareButton>
                <LinkedinShareButton
                  title={shareTitle}
                  source={`${window.location.href}`}
                  url={`${window.location.href}`}
                  summary="oceana.mrkt"
                >
                  <img src={linkedinSrc} alt="LinkedIn Share Link" />
                </LinkedinShareButton>
                <TwitterShareButton
                  title={shareTitle}
                  url={`${window.location.href}`}
                  via="oceana.mrkt"
                >
                  <img src={twitterSrc} alt="Twitter Share Link" />
                </TwitterShareButton>
                <EmailShareButton
                  subject="Shared Oceana.market Blog Post"
                  body={shareTitle}
                  url={`${window.location.href}`}
                  className="hide-sm"
                  style={{ display: "flex" }}
                >
                  <img src={emailSrc} alt="Email Share Link" />
                </EmailShareButton>
                <CopyToClipboard text={window.location.href} onCopy={toggleCopied}>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <img src={chainSrc} alt="URL Share Link" />
                    {actionMessage && <span className="click-status">Copied!</span>}
                  </button>
                </CopyToClipboard>
              </Share>
            </Sticky>
          </StyledPaddingContainer>
          <Body className="body-content" ref={bodyContentRef}>
            <Tldr>
              <ReactMarkdown linkTarget="_blank">
                {blogData?.tldr}
              </ReactMarkdown>
            </Tldr>
            <ReactMarkdown linkTarget="_blank">
              {blogData?.copy}
            </ReactMarkdown>
          </Body>
        </div>
        <BlogRelated dark={false} list={blogs.filter(blog => blog.url != title).sort((a, b) => 0.5 - Math.random())} heading={"RELATED POSTS"} />
      </ContainerBox>
    </BasePage>
  );
};

const Share = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  background: #FCFCFD;
  box-shadow: 0px 40px 48px -24px rgba(15,15,15,0.20);
  width: 96px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px 0;
  align-items: center;
  justify-content: center;
  @media screen and (max-width: ${RESPONSIVE.large}) {
    left: -40px;
  }
  @media screen and (max-width: ${RESPONSIVE.medium}) {
    position: fixed;
    top: initial;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 68px;
    flex-direction: row;
    padding: 0;
    margin-bottom: 0;
    z-index: 1;
    gap: 16px;
  }
`;

const StyledBackButton = styled.div`
  margin-top: 40px;
  @media screen and (max-width: ${RESPONSIVE.small}) {
    margin-top: 32px;
  }
  button {
    color: #353945 !important;
    border-color: #808191;
    &:hover {
      border-color: #353945;
      filter: none;
    }
  }
`;

const Tldr = styled.div`
  background: rgba(63, 140, 255, 0.08);
  padding: 32px 32px 40px;
  margin-bottom: 112px;
  ul li, ol li {
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
  }
  @media screen and (max-width: ${RESPONSIVE.small}) {
    margin-bottom: 80px;
  }
`;

const Body = styled.div`
  max-width: 664px;
  margin: auto;
  margin-bottom: 120px;
  text-align: left;
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-size: 24px;
  line-height: 32px;
  font-weight: 400;
  strong {
    font-weight: 600;
  }
  h3 {
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 600;
    font-size: 24px;
    line-height: 32px;
  }
  code {
    background: rgba(63, 140, 255, 0.08);
    padding: 32px 32px 40px;
    margin-bottom: 112px;
    @media screen and (max-width: ${RESPONSIVE.small}) {
      margin-bottom: 80px;
    }
  }
  p {
    padding: 0 0 32px;
    &:last-child {
      padding-bottom: 0;
    }
  }
  blockquote {
    position: relative;
    margin-bottom: 32px;
    padding-left: 27px;
    &:before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      border-radius: 3px;
      background-color: #6C5DD3;
      height: 100%;
      width: 6px;
    }
    p {
      padding: 0;
    }
  }
  img {
    width: 100%;
    margin: 24px 0;
  }
  ul {
    padding-left: 26px;
    li {
      margin-bottom: 32px;
      &:last-child {
        margin-bottom: 0; 
      }
    }
  }
  ol {
    padding-left: 26px;
    li {
      margin-bottom: 32px;
    }
  }
`;

const Headline = styled.div`
  max-width: 664px;
  margin: auto;
  text-align: left;
  display: flex;
  gap: 40px;
  flex-direction: column;
  margin-bottom: 112px;
  @media screen and (max-width: ${RESPONSIVE.large}) {
    margin-bottom: 96px;
  }
  @media screen and (max-width: ${RESPONSIVE.small}) {
    margin-bottom: 80px;
  }
  h1 {
    font-family: 'DM Sans';
    font-style: normal;
    font-weight: 700;
    font-size: 64px;
    line-height: 64px;
    letter-spacing: -0.02em;
    color: #1F2128;
    @media screen and (max-width: ${RESPONSIVE.small}) {
      font-size: 32px;
      line-height: 40px;
    }
  }
  @media screen and (max-width: ${RESPONSIVE.small}) {
    margin-bottom: 104px;
  }
`;

const Img = styled.div`
    width: 100%;
    height: 630px;
    background: #E6E8EC url(${(props: { src: string; }) => props.src});
    border-radius: 0;
    background-position: center;
    background-size: cover;
    margin-bottom: 112px;
    @media screen and (max-width: ${RESPONSIVE.large}) {
      height: 485px;
    }
    @media screen and (max-width: ${RESPONSIVE.small}) {
      height: 208px;
      margin-bottom: 80px;
    }
`;

// const BlogContainer = styled.div`
//   display: flex;
//   justify-content: space-between;
//   flex-wrap: wrap;
//   padding: 0;
//   gap: 0 28px;
//   max-width: 1120px;
//   margin: auto;
// `;

const StyledPaddingContainer = styled.div`
  padding-top: 96px;
  padding-bottom: 0;
  max-width: 1120px;
  margin: auto;
  @media screen and (max-width: ${RESPONSIVE.small}) {
    padding-top: 56px;
  }
  @media screen and (max-width: ${RESPONSIVE.small}) {
    padding-top: 40px;
  }
`;

// const HeroBanner = styled.div`
//   padding: 0 16px;
//   background: #E6E8EC;
//   height: 330px;
//   display: flex;
//   align-items: center;
//   flex-direction: column;
//   justify-content: center;
//   gap: 8px;
//   h1 {
//     font-family: 'Oswald';
//     font-style: normal;
//     font-weight: 700;
//     font-size: 56px;
//     line-height: 58px;
//     text-align: center;
//     letter-spacing: -0.02em;
//     color: ${colors.neutrals2};
//     margin: 0;
//   }
//   p {
//     padding: 0;
//     margin: 0;
//     font-family: 'Poppins';
//     font-style: normal;
//     font-weight: 500;
//     font-size: 14px;
//     line-height: 24px;
//     text-align: center;
//     color: ${colors.neutrals4};
//   }
//   @media screen and (max-width: ${RESPONSIVE.large}) {
//     height: 270px;
//   }
//   @media screen and (max-width: ${RESPONSIVE.small}) {
//     padding: 64px 16px 16px;
//     height: 196px;
//     h1 {
//       font-size: 40px;
//       line-height: 40px;
//     }
//     p {
//       font-size: 12px;
//       line-height: 12px;
//     }
//   }
// `;

export default BlogArticlePage;