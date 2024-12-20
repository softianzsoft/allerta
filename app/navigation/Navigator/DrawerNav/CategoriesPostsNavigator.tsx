import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import PostListScreen from "../../../screens/PostList";
import PostDetailScreen from "../../../screens/PostDetail";
import CommentsListScreen from "../../../screens/CommentsList";
import SignInScreen from "../../../screens/SignIn";
import SignUpScreen from "../../../screens/SignUp";
import ForgetPwdScreen from "../../../screens/ForgetPwd";
import { useRoute } from "@react-navigation/native";

const Stack = createStackNavigator();

const CategoriesPostsNavigator = (): React.ReactElement => (
  <Stack.Navigator>
    <Stack.Screen
      name="PostList"
      options={PostListScreen.navigationOptions}
      component={PostListScreen}
      initialParams={useRoute().params}
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

export default CategoriesPostsNavigator;
