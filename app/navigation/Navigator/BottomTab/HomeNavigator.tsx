import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "../../../screens/Home";
import PostDetailScreen from "../../../screens/PostDetail";
import CommentsListScreen from "../../../screens/CommentsList";
import SignInScreen from "../../../screens/SignIn";
import ForgetPwdScreen from "../../../screens/ForgetPwd";
import PostListScreen from "../../../screens/PostList";

const Stack = createStackNavigator();

const HomeNavigator = (): React.ReactElement => (
  <Stack.Navigator>
    <Stack.Screen name="Home" options={HomeScreen.navigationOptions} component={HomeScreen} />
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
    <Stack.Screen name="ForgetPwd" options={ForgetPwdScreen.navigationOptions} component={ForgetPwdScreen}/>
  </Stack.Navigator>
);

export default HomeNavigator;
