import _ from "lodash";
import { store } from '../store/store';

const state = store.getState();
const stringSet = state.stringSet;

export const skip = _.find(stringSet, { key: "skip" }).value;
export const next = _.find(stringSet, { key: "next" }).value;
export const prev = _.find(stringSet, { key: "prev" }).value;
export const done = _.find(stringSet, { key: "done" }).value;

//Home Strings
export const headbgHome = _.find(stringSet, { key: "headbgHome" }).value;
export const logoheadHome = _.find(stringSet, { key: "logoheadHome" }).value;
export const linearheadHome = _.find(stringSet, { key: "linearheadHome" }).value;
export const bellHome = _.find(stringSet, { key: "bellHome" }).value;
export const bellHomePressed = _.find(stringSet, { key: "bellHomePressed" }).value;
export const welcomeButtonHomeTitle =
	_.find(stringSet, { key: "welcomeButtonHomeTitle" }).value;
export const welcomeButtonHomeSubtitle =
	_.find(stringSet, { key: "welcomeButtonHomeSubtitle" }).value;
export const welcomeButtonHomeBg1 =
	_.find(stringSet, { key: "welcomeButtonHomeBg1" }).value;
export const welcomeButtonHomeBg2 =
	_.find(stringSet, { key: "welcomeButtonHomeBg2" }).value;
export const toastNotYetLoginText =
	_.find(stringSet, { key: "toastNotYetLoginText" }).value;
export const loginButtonText =
	_.find(stringSet, { key: "loginButtonText" }).value;
export const startPic = _.find(stringSet, { key: "startPic" }).value;
export const typeAnimationText =
	_.find(stringSet, { key: "typeAnimationText" }).value;
export const updatePageText =
	_.find(stringSet, { key: "updatePageText" }).value;
export const updatePageButton =
	_.find(stringSet, { key: "updatePageButton" }).value;