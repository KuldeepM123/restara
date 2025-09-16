import React from 'react';
import {
  Text as RNText,
  TextInput as RNTextInput,
  TextProps,
  TextInputProps,
} from 'react-native';

export const Text = (props: TextProps) => (
  <RNText {...props} allowFontScaling={false} />
);

export const TextInput = (props: TextInputProps) => (
  <RNTextInput {...props} allowFontScaling={false} />
);
