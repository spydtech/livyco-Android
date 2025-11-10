import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import React from "react";
import PaymentStyle from "../../styles/PaymentStyle";
import Colors from "../../styles/Colors";
import CommonStyles from "../../styles/CommonStyles";
import { Icons } from "../../components";
import { CommonActions } from "@react-navigation/native";

const HistoryDetailScreen = (props) => {
  const gotoBack = () => {
    props.navigation.dispatch(CommonActions.goBack());
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={PaymentStyle.homeContainer}
    >
      <StatusBar barStyle="light-content" backgroundColor={Colors.secondary} />
      <SafeAreaView
        style={{
          paddingTop: 10,
          backgroundColor: Colors.secondary,
        }}
      >
        <View style={[PaymentStyle.headerContainerBlue]}>
          <TouchableOpacity onPress={() => gotoBack()}>
            <Icons
              iconSetName={"MaterialCommunityIcons"}
              iconName={"arrow-left"}
              iconColor={Colors.white}
              iconSize={26}
            />
          </TouchableOpacity>
          <Text style={[PaymentStyle.titleText]}>{"History"}</Text>
        </View>
      </SafeAreaView>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{}}
        showsVerticalScrollIndicator={false}
      >
        <View style={[PaymentStyle.historyDetailsList]}>
          <View style={[PaymentStyle.mainPayContainer]}>
            <View style={[PaymentStyle.listContainer]}>
              <View style={[PaymentStyle.alphabateContainer]}>
                <Text style={[PaymentStyle.alphabateText]}>{"SN"}</Text>
              </View>
              <View style={[PaymentStyle.paymentSender]}>
                <Text style={[PaymentStyle.paidToText]}>{"Paid to"}</Text>
                <Text style={[PaymentStyle.senderName]}>{"Sender’s Name"}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => gotoPayDetails()}>
              <View style={[PaymentStyle.payArrow]}>
                <Icons
                  iconSetName={"MaterialCommunityIcons"}
                  iconName={"arrow-top-right"}
                  iconColor={Colors.selectedGreen}
                  iconSize={26}
                />
              </View>
            </TouchableOpacity>
          </View>
          <View style={[PaymentStyle.dateAmount]}>
            <Text style={[PaymentStyle.amountText]}>{"0000.00"}</Text>
            <Text style={[PaymentStyle.dateText]}>{"DD/MM/YYYYY"}</Text>
          </View>
        </View>
        <TouchableOpacity>
          <View style={[PaymentStyle.invoiceTextContainer]}>
            <Text style={[PaymentStyle.invoiceText]}>{"Download Invoice"}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <View style={[PaymentStyle.invoiceTextContainer]}>
            <Text style={[PaymentStyle.invoiceText]}>{"Share Invoice"}</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default HistoryDetailScreen;
