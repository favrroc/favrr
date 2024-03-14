import { NEWS_PER_PAGE } from "../../constants/base.const";

export const generateNewsQuery = (skip: number, favKeys: Array<string>) => `
  query getNews {
    getNews(skip: ${skip}, take: ${NEWS_PER_PAGE}, favKeys: [${favKeys.map(o => `"${o}"`)}]) {
      results {
        image
        title
        source
        date
        link
        code
        feed
        bixees {
          icons {
            key
            image
          }
        }
      }
      page
      pages
      count
    }
  }
`;