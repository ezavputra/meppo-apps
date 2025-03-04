import {
  ADD_CHAT,
  ADD_NOTIFICATION,
  ADD_SUBSCRIPTION_TOPIC,
  CLEAR_NOTIFICATIONS,
  CLEAR_SUBSCRIPTION_TOPICS,
  REMOVE_NOTIFICATION,
  REMOVE_SUBSCRIPTION_TOPIC,
  RESET_NEWS_CRITERIA,
  SET_USER_SESSION,
  SET_ACCESS_TOKEN,
  SET_ALERT,
  SET_BIOMETRIC,
  SET_CHATS,
  SET_CHOICE,
  SET_FARMER_LIST,
  SET_FARMER_PICKER,
  SET_FCM_TOKEN,
  SET_FILTER,
  SET_GEOLOCATION,
  SET_IMAGE,
  SET_JENIS_PROYEK,
  SET_KATEGORI_LAPORAN,
  SET_KOMODITAS,
  SET_LOADING,
  SET_NEWS_CRITERIA,
  SET_NOTIFICATIONS,
  SET_PIN,
  SET_SETTINGS,
  SET_UI,
  SET_ORDER_PAYMENT_SURVEY_COUNT,
  SET_PROMPT,
  SET_SNACKBAR,
  SET_SUBSCRIPTION_TOPICS,
  SET_STRINGS
} from "./actions";

// Authenticated user session
export const userSession = (state = null, action) => {
  const { type, payload } = action;

  switch (type) {
  case SET_USER_SESSION:
    return payload;

  default:
    return state;
  }
};

// Access token received after make an authentication
export const accessToken = (state = null, action) => {
  const { type, payload } = action;

  switch (type) {
  case SET_ACCESS_TOKEN:
    return payload;

  default:
    return state;
  }
};

// FCM Token for realtime messaging
export const fcmToken = (state = null, action) => {
  const { type, payload } = action;

  switch (type) {
  case SET_FCM_TOKEN:
    return payload;

  default:
    return state;
  }
};

// Loading condition (open or not)
export const loading = (state = false, action) => {
  const { type, payload } = action;

  switch (type) {
  case SET_LOADING:
    return payload;

  default:
    return state;
  }
};

// Alert info structure
export const alert = (
  state = {
    image: null,
    isOpen: false,
    title: "Alert",
    text: "",
    buttonLabel: "OK",
    onPressButton: () => {},
    onRequestClose: () => {}
  },
  action
) => {
  const { type, payload } = action;

  switch (type) {
  case SET_ALERT:
    return {
      ...state,
      ...payload
    };

  default:
    return state;
  }
};

// Choice structure
export const choice = (
  state = {
    isOpen: false,
    onPressBackdrop: () => {},
    items: [
      {
        label: "Choice 1",
        onPress: () => {}
      },
      {
        label: "Choice 2",
        onPress: () => {}
      }
    ]
  },
  action
) => {
  const { type, payload } = action;

  switch (type) {
  case SET_CHOICE:
    return {
      ...state,
      ...payload
    };

  default:
    return state;
  }
};

// Criteria to find news in Home page
export const newsCriteria = (
  state = {
    keyword: "",
    category: null,
    dateStart: null,
    dateEnd: null,
    location: null,
    sortBy: "latest"
  },
  action
) => {
  const { type, payload } = action;

  switch (type) {
  case SET_NEWS_CRITERIA:
    return {
      ...state,
      ...payload
    };

  case RESET_NEWS_CRITERIA:
    return {
      keyword: "",
      category: null,
      dateStart: null,
      dateEnd: null,
      location: null,
      sortBy: "latest"
    };

  default:
    return state;
  }
};

// User notifications
export const notifications = (state = [], action) => {
  const { type, payload } = action;

  switch (type) {
  case ADD_NOTIFICATION:
    return [...state, payload];

  case REMOVE_NOTIFICATION:
    return state.filter(item => item.id !== payload);

  case CLEAR_NOTIFICATIONS:
    return [];

  case SET_NOTIFICATIONS:
    return [...payload];

  default:
    return state;
  }
};

// FCM subscription topics for notifications
export const subscriptionTopics = (state = [], action) => {
  const { type, payload } = action;

  switch (type) {
  case ADD_SUBSCRIPTION_TOPIC:
    return [...state, payload];

  case REMOVE_SUBSCRIPTION_TOPIC:
    return state.filter(item => item !== payload);

  case CLEAR_SUBSCRIPTION_TOPICS:
    return [];

  case SET_SUBSCRIPTION_TOPICS:
    return [...payload];

  default:
    return state;
  }
};

// Group chats
export const chats = (state = [], action) => {
  const { type, payload } = action;

  switch (type) {
  case ADD_CHAT:
    return [...state, payload];

  case SET_CHATS:
    return [...payload];

  default:
    return state;
  }
};

// Alert info structure
export const image = (
  state = {
    image: null,
    isOpen: false,
    onPressBackdrop: () => {}
  },
  action
) => {
  const { type, payload } = action;

  switch (type) {
  case SET_IMAGE:
    return {
      ...state,
      ...payload
    };

  default:
    return state;
  }
};

// User auto detect location indicator
export const geolocation = (state = "standard", action) => {
  const { type, payload } = action;

  switch (type) {
  case SET_GEOLOCATION:
    return payload;

  default:
    return state;
  }
};

// Modal Filter
export const filters = (
  state = {
    isOpen: false,
    title: "Filter",
    onPressClose: () => {},
    onPressSubmit: () => {}
  },
  action
) => {
  const { type, payload } = action;

  switch (type) {
  case SET_FILTER:
    return {
      ...state,
      ...payload
    };

  default:
    return state;
  }
};

// Modal Komoditas
export const komoditas = (
  state = {
    isOpen: false,
    title: "Komoditas",
    items: [],
    onPressClose: () => {},
    onPressSelected: () => {}
  },
  action
) => {
  const { type, payload } = action;

  switch (type) {
  case SET_KOMODITAS:
    return {
      ...state,
      ...payload
    };

  default:
    return state;
  }
};

// Modal Kategori Laporan
export const kategoriLaporan = (
  state = {
    isOpen: false,
    title: "Kategori laporan",
    items: [],
    onPressClose: () => {},
    onPressSelected: () => {}
  },
  action
) => {
  const { type, payload } = action;

  switch (type) {
  case SET_KATEGORI_LAPORAN:
    return {
      ...state,
      ...payload
    };

  default:
    return state;
  }
};

// Modal Jenis Proyek
export const jenisProyek = (
  state = {
    isOpen: false,
    title: "Jenis proyek",
    items: [],
    onPressClose: () => {},
    onPressSelected: () => {}
  },
  action
) => {
  const { type, payload } = action;

  switch (type) {
  case SET_JENIS_PROYEK:
    return {
      ...state,
      ...payload
    };

  default:
    return state;
  }
};

// Modal Farmer List
export const farmerList = (
  state = {
    isOpen: false,
    title: "Pekerja Tani",
    farmers: [],
    onRequestClose: () => {}
  },
  action
) => {
  const { type, payload } = action;

  switch (type) {
  case SET_FARMER_LIST:
    return {
      ...state,
      ...payload
    };

  default:
    return state;
  }
};


// SnackBar
export const snackbar = (
  state = {
    visibleSnack: false,
    message: "Message"
  },
  action
) => {
  const { type, payload } = action;

  switch (type) {
  case SET_SNACKBAR:
    return {
      ...state,
      ...payload
    };

  default:
    return state;
  }
};

// Modal Popup Biometric
export const biometric = (
  state = {
    isOpen: false,
    onCancel: () => {},
    onError: () => {},
    onSuccess: () => {}
  },
  action
) => {
  const { type, payload } = action;

  switch (type) {
  case SET_BIOMETRIC:
    return {
      ...state,
      ...payload
    };

  default:
    return state;
  }
};

// User PIN and used to auto-fill PIN field
export const pin = (state = null, action) => {
  const { type, payload } = action;

  switch (type) {
  case SET_PIN:
    return payload;

  default:
    return state;
  }
};

export const settings = (state = [], action ) => {
  const { type, payload } = action;

  switch (type) {
  case SET_SETTINGS:
    return {
      ...state,
      ...payload
    };

  default:
    return state;
  }
};

export const stringSet = (state = [], action ) => {
  const { type, payload } = action;

  switch (type) {
  case SET_STRINGS:
    return {
      ...state,
      ...payload
    };

  default:
    return state;
  }
};

export const UISet = (state = [], action ) => {
  const { type, payload } = action;

  switch (type) {
  case SET_UI:
    return {
      ...state,
      ...payload
    };

  default:
    return state;
  }
};

export const orderPaymentSurveyCount = (state = 0, action ) => {
  const { type, payload } = action;

  switch (type) {
  case SET_ORDER_PAYMENT_SURVEY_COUNT:
    return payload;

  default:
    return state;
  }
};
