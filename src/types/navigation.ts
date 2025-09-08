import { StackNavigationProp } from "@react-navigation/stack";

export type RootStackParamList = {
  Splash: undefined;
  Main: undefined;
};

export type SplashScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Splash"
>;
