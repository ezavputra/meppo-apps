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
  SET_STRINGS,
  SET_UI,
  SET_ORDER_PAYMENT_SURVEY_COUNT,
  SET_PROMPT,
  SET_SNACKBAR,
  SET_SUBSCRIPTION_TOPICS
} from "./actions";

/**
 * Get action to set user session
 *
 * @param {object} user - User session
 */
export const setUserSession = user => ({
  type: SET_USER_SESSION,
  payload: user
});

/**
 * Get action to set access token
 *
 * @param {string} token - Access token
 */
export const setAccessToken = token => ({
  type: SET_ACCESS_TOKEN,
  payload: token
});

/**
 * Get action to set FCM token
 *
 * @param {string} token - Access token
 */
export const setFCMToken = token => ({
  type: SET_FCM_TOKEN,
  payload: token
});

/**
 * Get action to set loading open or not
 *
 * @param {string} isOpen - Set loading to open or not
 */
export const setLoading = isOpen => ({
  type: SET_LOADING,
  payload: isOpen
});

/**
 * Get action to set alert structure
 *
 * @param {object} options - Alert structure
 */
export const setAlert = options => ({
  type: SET_ALERT,
  payload: options
});

/**
 * Get action to set choice structure
 *
 * @param {object} options - Choice structure
 */
export const setChoice = options => ({
  type: SET_CHOICE,
  payload: options
});

/**
 * Get action to set news criteria in home page
 *
 * @param {object} criteria - Criteria to find news
 */
export const setNewsCriteria = criteria => ({
  type: SET_NEWS_CRITERIA,
  payload: criteria
});

/**
 * Get action to reset news criteria in home page
 */
export const resetNewsCriteria = () => ({
  type: RESET_NEWS_CRITERIA
});

/**
 * Get action to add new notification
 */
export const addNotification = notification => ({
  type: ADD_NOTIFICATION,
  payload: notification
});

/**
 * Get action to remove a notification
 */
export const removeNotification = notificationID => ({
  type: REMOVE_NOTIFICATION,
  payload: notificationID
});

/**
 * Get action to clear notifications
 */
export const clearNotifications = () => ({
  type: CLEAR_NOTIFICATIONS
});

/**
 * Get action to set notifications
 */
export const setNotifications = notifications => ({
  type: SET_NOTIFICATIONS,
  payload: notifications
});

/**
 * Get action to set fcm subscription topics
 *
 * @param {string[]} topics - Topic list
 */
export const setSubscriptionTopics = topics => ({
  type: SET_SUBSCRIPTION_TOPICS,
  payload: topics
});

/**
 * Get action to clear subscription topics
 */
export const clearSubscriptionTopics = () => ({
  type: CLEAR_SUBSCRIPTION_TOPICS
});

/**
 * Get action to add new subscription topic
 */
export const addSubscriptionTopic = topic => ({
  type: ADD_SUBSCRIPTION_TOPIC,
  payload: topic
});

/**
 * Get action to remove subscription topic
 */
export const removeSubscriptionTopic = topic => ({
  type: REMOVE_SUBSCRIPTION_TOPIC,
  payload: topic
});

/**
 * Get action to set chat messages
 */
export const setChats = chats => ({
  type: SET_CHATS,
  payload: chats
});

/**
 * Get action to add new incoming chat message
 */
export const addChat = chat => ({
  type: ADD_CHAT,
  payload: chat
});

/**
 * Get action to set modal image
 */
export const setImage = options => ({
  type: SET_IMAGE,
  payload: options
});

/**
 * Get action to set geoocation indicator
 */
export const setGeolocation = indicator => ({
  type: SET_GEOLOCATION,
  payload: indicator
});

/**
 * Get action to set modal filters
 */
export const setFilter = filters => ({
  type: SET_FILTER,
  payload: filters
});

/**
 * Get action to set modal komoditas
 */
export const setKomoditas = komoditas => ({
  type: SET_KOMODITAS,
  payload: komoditas
});

/**
 * Get action to set modal kategori laporan
 */
export const setKategoriLaporan = kategoriLaporan => ({
  type: SET_KATEGORI_LAPORAN,
  payload: kategoriLaporan
});

/**
 * Get action to set modal jenis proyek
 */
export const setJenisProyek = jenisProyek => ({
  type: SET_JENIS_PROYEK,
  payload: jenisProyek
});

/**
 * Get action to set modal farmer list
 */
export const setFarmerList = farmerList => ({
  type: SET_FARMER_LIST,
  payload: farmerList
});

export const setSnackbar = snackbar => ({
  type: SET_SNACKBAR,
  payload: snackbar
});

/**
 * Get action to set modal popup biometric
 */
export const setBiometric = biometric => ({
  type: SET_BIOMETRIC,
  payload: biometric
});

/**
 * Get action to set PIN
 */
export const setPin = pin => ({
  type: SET_PIN,
  payload: pin
});

/**
 * Get action to set Settings
 */
export const setSettings = settings => ({
  type: SET_SETTINGS,
  payload: settings
});

export const setStrings = strings => ({
  type: SET_STRINGS,
  payload: strings
});

export const setUI = ui => ({
  type: SET_UI,
  payload: ui
});

/**
 * Get action to set Order Payment Survey Count
 */
export const setOrderPaymentSurveyCount = count => ({
  type: SET_ORDER_PAYMENT_SURVEY_COUNT,
  payload: count
});