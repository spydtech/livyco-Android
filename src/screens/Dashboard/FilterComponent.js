import CheckBox from "@react-native-community/checkbox";
import Slider from "@react-native-community/slider";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  FlatList,
} from "react-native";
import HomeStyle from "../../styles/HomeStyle";
import { Button, Icons } from "../../components";
import Colors from "../../styles/Colors";
import CommonStyles from "../../styles/CommonStyles";
import LayoutStyle from "../../styles/LayoutStyle";

const FilterComponent = ({ onApply, onClear, isFilterlShow }) => {
  const [selectedGender, setSelectedGender] = useState("Male");
  const [selectedRoom, setSelectedRoom] = useState("Single Sharing");
  const [budget, setBudget] = useState(20000);
  const [ratings, setRatings] = useState(null);
  const [amenities, setAmenities] = useState([
    {
      id: 1,
      name: "Free WIFI",
      selected: false,
      iconSetName: "FontAwesome",
      iconName: "wifi",
    },
    {
      id: 2,
      name: "Gym",
      selected: false,
      iconSetName: "FontAwesome6",
      iconName: "dumbbell",
    },
    {
      id: 3,
      name: "Parking",
      selected: false,
      iconSetName: "FontAwesome",
      iconName: "car",
    },
    {
      id: 4,
      name: "A.C",
      selected: true,
      iconSetName: "FontAwesome6",
      iconName: "snowflake",
    },
    {
      id: 5,
      name: "Meals",
      selected: true,
      iconSetName: "MaterialIcons",
      iconName: "lunch-dining",
    },
    {
      id: 6,
      name: "Iron",
      selected: true,
      iconSetName: "MaterialCommunityIcons",
      iconName: "iron",
    },
    {
      id: 7,
      name: "Power Backup",
      selected: true,
      iconSetName: "MaterialCommunityIcons",
      iconName: "flash",
    },
    {
      id: 8,
      name: "Security",
      selected: true,
      iconSetName: "FontAwesome6",
      iconName: "user-shield",
    },
    {
      id: 9,
      name: "Laundry",
      selected: true,
      iconSetName: "MaterialCommunityIcons",
      iconName: "washing-machine",
    },
    {
      id: 10,
      name: "Refrigerator",
      selected: false,
      iconSetName: "AntDesign",
      iconName: "database",
    },
    {
      id: 11,
      name: "Lift",
      selected: false,
      iconSetName: "MaterialIcons",
      iconName: "elevator",
    },
    {
      id: 12,
      name: "CC TV",
      selected: true,
      iconSetName: "MaterialCommunityIcons",
      iconName: "cctv",
    },
    {
      id: 13,
      name: "Solar Power",
      selected: false,
      iconSetName: "MaterialIcons",
      iconName: "solar-power",
    },
    {
      id: 14,
      name: "Smoking",
      selected: false,
      iconSetName: "MaterialCommunityIcons",
      iconName: "smoking",
    },
    {
      id: 15,
      name: "Drinking",
      selected: true,
      iconSetName: "MaterialCommunityIcons",
      iconName: "food-fork-drink",
    },
    {
      id: 16,
      name: "Students Only",
      selected: false,
      iconSetName: "MaterialCommunityIcons",
      iconName: "school",
    },
    {
      id: 17,
      name: "Professionals only",
      selected: false,
      iconSetName: "MaterialCommunityIcons",
      iconName: "account-outline",
    },
    {
      id: 18,
      name: "Fire Safety",
      selected: false,
      iconSetName: "MaterialCommunityIcons",
      iconName: "fire-extinguisher",
    },
    {
      id: 19,
      name: "Others",
      selected: true,
      iconSetName: "MaterialCommunityIcons",
      iconName: "food-fork-drink",
    },
  ]);

  const toggleAmenity = (id) => {
    const updated = amenities.map((item) =>
      item.id === id ? { ...item, selected: !item.selected } : item
    );
    setAmenities(updated);
  };

  const toggleRating = (index) => {
    setRatings(index === setRatings ? null : index);
  };

  const handleApply = () => {
    const selectedData = {
      gender: selectedGender,
      roomType: selectedRoom,
      budget,
      ratings: ratings
        .map((selected, index) => (selected ? 5 - index : null))
        .filter((val) => val !== null),
      amenities: amenities
        .filter((item) => item.selected)
        .map((item) => item.name),
    };
    onApply(selectedData);
  };
  const gotoClosesFilter = () => {
    console.log("in print=>");
    isFilterlShow(false);
  };

  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: "20%" }}
      style={HomeStyle.filterContainer}
    >
      <View style={{ ...CommonStyles.directionRowSB }}>
        <Text style={HomeStyle.filterTitle}>{"I'm Looking to"}</Text>
        <TouchableOpacity onPress={() => gotoClosesFilter()}>
          <Icons
            iconSetName={"FontAwesome6"}
            iconName={"xmark"}
            iconColor={Colors.black}
            iconSize={24}
          />
        </TouchableOpacity>
      </View>
      <View style={[HomeStyle.gendercontainer]}>
        <View style={{ ...CommonStyles.directionRowCenter }}>
          <Icons
            iconSetName={"MaterialCommunityIcons"}
            iconName={"human-male-female"}
            iconColor={Colors.gray}
            iconSize={20}
          />
          <Text style={[HomeStyle.sectionTitle]}>{"Type"}</Text>
        </View>
        <View style={HomeStyle.genderSection}>
          {["Male", "Female", "Co-Living"].map((item, index) => (
            <TouchableOpacity
              key={`gender-${index}`}
              style={[
                HomeStyle.genderBox,
                selectedGender === item && HomeStyle.selectedGenderBox,
              ]}
              onPress={() => setSelectedGender(item)}
            >
              <Text
                style={[
                  HomeStyle.genderText,
                  selectedGender === item && HomeStyle.selectedGenderText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={[HomeStyle.gendercontainer, { ...LayoutStyle.marginTop20 }]}>
        <View style={{ ...CommonStyles.directionRowCenter }}>
          <Icons
            iconSetName={"Ionicons"}
            iconName={"bed-outline"}
            iconColor={Colors.gray}
            iconSize={20}
          />
          <Text style={[HomeStyle.sectionTitle]}>{"Room Type"}</Text>
        </View>
        <ScrollView horizontal>
          <View style={HomeStyle.roomTypeContainer}>
            {[
              "Single Sharing",
              "Double Sharing",
              "Triple Sharing",
              "Four Sharing",
              "Five Sharing",
              "Five + Sharing",
            ].map((item, index) => (
              <TouchableOpacity
                key={`room-${index}`}
                style={[
                  HomeStyle.roomTypeBox,
                  selectedRoom === item && HomeStyle.selectedRoomTypeBox,
                ]}
                onPress={() => setSelectedRoom(item)}
              >
                <Text
                  style={[
                    HomeStyle.genderText,
                    selectedRoom === item && HomeStyle.selectedGenderText,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
      <View style={[HomeStyle.gendercontainer, { ...LayoutStyle.marginTop20 }]}>
        <View style={{ ...CommonStyles.directionRowCenter }}>
          <Icons
            iconSetName={"Ionicons"}
            iconName={"pricetag"}
            iconColor={Colors.gray}
            iconSize={20}
          />
          <Text style={[HomeStyle.sectionTitle]}>{"Budget"}</Text>
        </View>
        <View style={HomeStyle.sliderContainer}>
          <View style={{ ...CommonStyles.directionRowSB }}>
            <Text style={[HomeStyle.textBudge]}>{"₹ 500"}</Text>
            <Text style={[HomeStyle.textBudge]}>{"₹ 90,000"}</Text>
          </View>

          <View>
            <Slider
              minimumValue={500}
              maximumValue={90000}
              step={500}
              value={budget}
              onValueChange={setBudget}
              minimumTrackTintColor={Colors.secondary}
              maximumTrackTintColor="#000090"
            />
          </View>
          {/* <Text>₹ {budget}</Text> */}
          <View style={{ ...CommonStyles.directionRowSB }}>
            <Text style={[HomeStyle.textMini]}>{"Minimun"}</Text>
            <Text style={[HomeStyle.textMini]}>{"Miximun"}</Text>
          </View>
        </View>
      </View>
      <View style={[HomeStyle.gendercontainer, { ...LayoutStyle.marginTop20 }]}>
        <View
          style={{
            ...LayoutStyle.marginBottom10,
          }}
        >
          <Icons
            iconSetName={"MaterialCommunityIcons"}
            iconName={"star-circle"}
            iconColor={Colors.gray}
            iconSize={20}
          />
          <Text style={[HomeStyle.sectionTitle]}>{"Rating"}</Text>
        </View>
        {[1, 2, 3, 4, 5].map((starCount, index) => (
          <View
            key={index}
            style={{
              ...LayoutStyle.marginTop5,
            }}
          >
            <TouchableOpacity onPress={() => toggleRating(index)}>
              <Icons
                iconSetName={"Ionicons"}
                iconName={
                  ratings === index ? "checkbox-outline" : "square-outline"
                }
                iconColor={Colors.gray}
                iconSize={26}
              />
            </TouchableOpacity>
            {[...Array(5)].map((_, i) => (
              <View style={{ ...LayoutStyle.paddingLeft5 }}>
                <Icons
                  iconSetName={"Ionicons"}
                  iconName={i < starCount ? "star" : "star-outline"}
                  iconColor={Colors.primary}
                  iconSize={26}
                />
              </View>
            ))}
          </View>
        ))}
      </View>
      <View style={[HomeStyle.gendercontainer, { ...LayoutStyle.marginTop20 }]}>
        <View style={{ ...CommonStyles.directionRowCenter }}>
          <Icons
            iconSetName={"MaterialCommunityIcons"}
            iconName={"star-circle"}
            iconColor={Colors.gray}
            iconSize={20}
          />
          <Text style={[HomeStyle.sectionTitle]}>{"Amenities"}</Text>
        </View>

        <FlatList
          data={amenities}
          keyExtractor={(item) => `amenity-${item.id}`}
          numColumns={4} // or adjust based on your layout needs
          contentContainerStyle={HomeStyle.genderSection}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                HomeStyle.amenityButton,
                item.selected && HomeStyle.selectedAmenity,
              ]}
              onPress={() => toggleAmenity(item.id)}
            >
              <View style={[HomeStyle.textIconContainer]}>
                <View style={{ ...LayoutStyle.marginTop10 }}>
                  <Icons
                    iconSetName={item.iconSetName}
                    iconName={item.iconName}
                    iconColor={item.selected ? Colors.paleBlue : Colors.gray}
                    iconSize={20}
                  />
                </View>
                <Text
                  style={[
                    HomeStyle.amenityText,
                    item.selected && HomeStyle.selectedAmenityText,
                  ]}
                >
                  {item.name}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
      <View style={[HomeStyle.btnFilterContainer]}>
        <Button
          flexContainer={{ flexGrow: 0.456 }}
          btnName={"Apply"}
          onPress={handleApply}
        />
        <Button
          flexContainer={{ flexGrow: 0.456 }}
          btnStyle={[HomeStyle.btnStyle]}
          btnName={"Clear filter"}
          onPress={onClear}
          btnTextColor={Colors.secondary}
        />
      </View>
    </ScrollView>
  );
};

export default FilterComponent;
