import * as React from 'react';

export const navigationRef = React.createRef();

export function navigate(name, params) {
    navigationRef.current?.navigate(name, params);
}

export function dispatch(CommonActions) {
    navigationRef.current?.dispatch(CommonActions);
}

export function getCurrentRouteName() {
    return navigationRef.current?.getCurrentRoute().name;
}

export function goBack() {
    navigationRef.current?.goBack();
}