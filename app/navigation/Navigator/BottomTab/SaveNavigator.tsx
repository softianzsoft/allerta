import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import PostListScreen from "../../../screens/PostList";
import SignInScreen from "../../../screens/SignIn";
import SignUpScreen from "../../../screens/SignUp";
import PostDetailScreen from "../../../screens/PostDetail";
import CommentsListScreen from "../../../screens/CommentsList";
import ForgetPwdScreen from "../../../screens/ForgetPwd";

const Stack = createStackNavigator();

const SaveNavigator = (): React.ReactElement => (
  <Stack.Navigator>
    <Stack.Screen name="Save" options={PostListScreen.navigationOptions} component={PostListScreen} initialParams={{ action: "bookmarks" }} />
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

export default SaveNavigator;
