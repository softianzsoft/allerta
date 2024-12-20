import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { NavStatelessComponent } from "interfaces";
import { Text } from "components";
import { Colors } from "style";
import { PostsAPI } from "webservice";

import navigationOptions from "./CustomPageScreen.navigationOptions";
import styles from "./CustomPageScreen.styles";
import { useNavigation, useRoute } from "@react-navigation/native";
import RenderHtml from "react-native-render-html";
import { Ionicons } from "@expo/vector-icons";
import { navigate } from "navigation";

const CategorySelectionScreen: NavStatelessComponent = () => {
  const route = useRoute();
  const page = route.params;
  const [pageData, setPageData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const { width } = useWindowDimensions();
  const navigation = useNavigation();
  const navigator = navigate(navigation);

  useEffect(() => {
    console.log("getting page data");
    setLoading(true);
    PostsAPI.page(page.pageID).then((data) => {
      if (data.result[0]) {
        setPageData(data.result[0]);
      }
      setLoading(false);
    });
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.white }}>
      <LinearGradient colors={["#F3F9F3", "#FFFFFF"]} style={styles.linearGradient}/>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text.Header style={styles.headerTtle}>{page.title}</Text.Header>
          <TouchableOpacity style={styles.back_btn}>
            <Ionicons
              name="chevron-back-outline"
              size={20}
              color={Colors.blackGrey}
              onPress={() => navigator.goBack()}
            />
          </TouchableOpacity>
        </View>
        {!isLoading ?
          <View style={styles.mainContent}>
            <RenderHtml contentWidth={width - 50} source={{ html: pageData.post_content }} />
          </View> : (
          <ActivityIndicator animating={isLoading} size="large" color="#000000" />
        )}
      </ScrollView>
    </View>
  );
};

CategorySelectionScreen.navigationOptions = navigationOptions();

export default CategorySelectionScreen;
