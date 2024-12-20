import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import NotificationScreen from "../../../screens/Notification";
import SignInScreen from "../../../screens/SignIn";
import SignUpScreen from "../../../screens/SignUp";
import PostListScreen from "../../../screens/PostList";
import PostDetailScreen from "../../../screens/PostDetail";
import CommentsListScreen from "../../../screens/CommentsList";
import ForgetPwdScreen from "../../../screens/ForgetPwd";

const Stack = createStackNavigator();

const NotficationNavigator = (): React.ReactElement => (
  <Stack.Navigator>
    <Stack.Screen
      name="NotificationScreen"
      options={NotificationScreen.navigationOptions}
      component={NotificationScreen}
    />
    <Stack.Screen
      name="PostList"
      options={PostListScreen.navigationOptions}
      component={PostListScreen}
    />
    <Stack.Screen
      name="PostDetail"
      options={PostDetailScreen.navigationOptions}
      component={PostDetailScreen}
    />
    <Stack.Screen
      name="CommentsList"
      options={CommentsListScreen.navigationOptions}
      component={CommentsListScreen}
    />
    <Stack.Screen
      name="SignInScreen"
      options={SignInScreen.navigationOptions}
      component={SignInScreen}
    />
    <Stack.Screen name="SignUp" options={SignUpScreen.navigationOptions} component={SignUpScreen} />
    <Stack.Screen name="ForgetPwd" options={ForgetPwdScreen.navigationOptions} component={ForgetPwdScreen} />
  </Stack.Navigator>
);

export default NotficationNavigator;
