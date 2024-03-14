import React from "react";
import styled from "styled-components";

import SEO from "../../components/seo/SEO";
import { RESPONSIVE } from "../../core/constants/responsive.const";
import { colors } from "../../core/constants/styleguide.const";
import BasePage from "../base-page/BasePage";
import "./blog-page.scss";
import BlogTile from "../../components/blog/blog-tile/BlogTile";
import { blogs } from "../../core/constants/blogs.const";

const BlogPage = () => {

  return (
    <BasePage
      className="blog-page"
      contentStyle={{paddingBottom: 0}}
    >
      <SEO
        title={`Blog`}
        description={`Oceana Blog`}
        name={`Oceana Market`}
        type={`Blog Page`}
      />
      <HeroBanner>
        <p>ALL THE GOODS IN ONE PLACE</p>
        <h1>OCEANA BLOG</h1>
      </HeroBanner>
      <StyledPaddingContainer>
        <BlogContainer>
          {blogs.map((tile, index) => <BlogTile key={tile.url} featured={true} hideDetail={index === 0 ? false : true} tile={tile} />)}
        </BlogContainer>
      </StyledPaddingContainer>
    </BasePage>
  );
};

const BlogContainer = styled.div`
  display: flex;
  justify-content: normal;
  flex-wrap: wrap;
  padding: 0;
  gap: 0 28px;
  max-width: 1120px;
  margin: auto;
`;

const StyledPaddingContainer = styled.div`
  padding-top: 96px;
  padding-bottom: 0;
  padding-left: 76px;
  padding-right: 76px;
  max-width: 1120px;
  margin: auto;

  @media (max-width: ${RESPONSIVE.large}) {
    padding-left: 80px;
    padding-right: 80px;
  }
  @media (max-width: ${RESPONSIVE.medium}) {
    padding-left: 56px;
    padding-right: 56px;
  }
  @media (max-width: ${RESPONSIVE.small}) {
    padding-left: 32px;
    padding-right: 32px;
    padding-top: 64px;
  }
  @media (max-width: ${RESPONSIVE.xSmall}) {
    padding-left: 4px;
    padding-right: 4px;
  }
`;

const HeroBanner = styled.div`
  padding: 0 16px;
  background: #E6E8EC;
  height: 330px;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
  h1 {
    font-family: 'Oswald';
    font-style: normal;
    font-weight: 700;
    font-size: 56px;
    line-height: 58px;
    text-align: center;
    letter-spacing: -0.02em;
    color: ${colors.neutrals2};
    margin: 0;
  }
  p {
    padding: 0;
    margin: 0;
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 24px;
    text-align: center;
    color: ${colors.neutrals4};
  }
  @media screen and (max-width: ${RESPONSIVE.large}) {
    height: 270px;
  }
  @media screen and (max-width: ${RESPONSIVE.small}) {
    padding: 0 16px 0;
    height: 196px;
    h1 {
      font-size: 40px;
      line-height: 40px;
    }
    p {
      font-size: 12px;
      line-height: 12px;
    }
  }
`;

export default BlogPage;