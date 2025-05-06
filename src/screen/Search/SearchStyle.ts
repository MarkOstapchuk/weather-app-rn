import { StyleSheet } from "react-native";
import { AppColors } from "../../constants/Colors";

export const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: AppColors.white
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    gap: 20,
    width: "100%"
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: AppColors.mediumGray,
    borderRadius: 8,
    padding: 8,
    backgroundColor: AppColors.white,
    width: "75%",
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 1
  },
  textInput: {
    fontSize: 16,
    color: AppColors.black,
    borderBottomColor: AppColors.blue,
    borderBottomWidth: 1,
    flex: 1,
    paddingBottom: 5
  },
  flatList: {
    marginBottom: 35
  },
});
