import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import CustomPageScreen from "../../../screens/CustomPage";

const Stack = createStackNavigator();

const CustomPageNavigator = (): React.ReactElement => (
  <Stack.Navigator>
    <Stack.Screen
      name="CustomPageScreen"
      options={CustomPageScreen.navigationOptions}
      component={CustomPageScreen}
    />
  </Stack.Navigator>
);

export default CustomPageNavigator;
