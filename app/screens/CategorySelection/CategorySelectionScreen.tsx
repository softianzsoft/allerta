import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

import { navigate } from "navigation";
import { NavStatelessComponent } from "interfaces";
import { Text, Category } from "components";
import { t } from "utils";
import { Colors } from "style";
import { CategoriesAPI } from "webservice";

import navigationOptions from "./CategorySelectionScreen.navigationOptions";
import styles from "./CategorySelectionScreen.styles";

const CategorySelectionScreen: NavStatelessComponent = () => {
  const navigation = useNavigation();
  const navigator = navigate(navigation);
  const [categoryList, setCategories] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    console.log("getting categories");
    setLoading(true);
    CategoriesAPI.list().then((data) => {
      setCategories(data);
      setLoading(false);
    });
  }, []);

  const onPress = (category) => {
    console.log("go to ", category);
    navigator.openPostList(category);
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.white }}>
      <LinearGradient colors={["#F3F9F3", "#FFFFFF"]} style={styles.linearGradient}/>
      <ScrollView style={styles.container}>
        <Text.Header style={styles.header}>{t("CATEGORY_SCREEN_TITLE")}</Text.Header>
        {categoryList.length > 0 ? (
          categoryList.map((category) => (
            <Category
              key={category.id}
              text={category.name}
              onPress={() => onPress(category)}
              uri={category.image}
            />
          ))
        ) : (
          <></>
        )}
        <ActivityIndicator animating={isLoading} size="large" color="#000000" />
      </ScrollView>
    </View>
  );
};

CategorySelectionScreen.navigationOptions = navigationOptions();

export default CategorySelectionScreen;
