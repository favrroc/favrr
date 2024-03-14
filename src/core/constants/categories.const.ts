import { defineMessages } from "react-intl";

import { COMMONS } from "../../assets/i18n/commons";

const categorieMessages = defineMessages({
  politicians: {
    defaultMessage: "politicians",
  },
  celebrities: {
    defaultMessage: "celebrities",
  },
  athletes: {
    defaultMessage: "athletes",
  },
  entrepreneurs: {
    defaultMessage: "entrepreneurs",
  },
  activists: {
    defaultMessage: "activists",
  },
});

export const CATEGORIES = {
  all: {
    id: null,
    message: COMMONS.all,
  },
  politicians: {
    id: "politicians",
    message: categorieMessages.politicians,
  },
  celebrities: {
    id: "celebrities",
    message: categorieMessages.celebrities,
  },
  athletes: {
    id: "athletes",
    message: categorieMessages.athletes,
  },
  entrepreneurs: {
    id: "entrepreneurs",
    message: categorieMessages.entrepreneurs,
  },
  activists: {
    id: "activists",
    message: categorieMessages.activists,
  },
};
