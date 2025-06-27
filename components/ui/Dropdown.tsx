import AntDesign from "@expo/vector-icons/AntDesign";
import React, { useState } from "react";
import { StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useTheme } from "react-native-paper";

const toRGBA = (rgb: string, alpha: number) =>
  rgb.replace("rgb", "rgba").replace(")", `, ${alpha})`);

type DropdownItem = {
  label: string;
  value: string;
};

interface AppDropdownProps {
  label?: string;
  data: DropdownItem[];
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
  iconName?: keyof typeof AntDesign.glyphMap;
  containerStyle?: ViewStyle;
  dropdownStyle?: ViewStyle;
  labelStyle?: TextStyle;
}

const AppDropdown: React.FC<AppDropdownProps> = ({
  label,
  data,
  value,
  onChange,
  placeholder = "Select item",
  iconName = "down",
  containerStyle,
  dropdownStyle,
  labelStyle,
}) => {
  const { colors, dark } = useTheme();
  console.log({ dark });
  const [isFocus, setIsFocus] = useState(false);

  const renderLabel = () => {
    if (label && (value || isFocus)) {
      return (
        <Text
          style={[
            styles.label,
            { color: colors.primary, backgroundColor: colors.background },
            labelStyle,
          ]}
        >
          {label}
        </Text>
      );
    }
    return null;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {renderLabel()}
      <Dropdown
        style={[
          styles.dropdown,
          {
            borderColor: isFocus ? colors.primary : colors.outline,
            backgroundColor: colors.surface,
            borderWidth: isFocus ? 2 : 1,
          },
          dropdownStyle,
        ]}
        placeholderStyle={{
          ...styles.placeholderStyle,
          color: colors.onSurfaceDisabled || colors.onSurface,
        }}
        containerStyle={{
          backgroundColor: colors.surface,
          borderRadius: 4,
          borderColor: dark ? "#2C2C2E" : "#2C2C2E",
          borderWidth: 1,
        }}
        selectedTextStyle={{
          ...styles.selectedTextStyle,
          color: colors.onSurface,
        }}
        inputSearchStyle={{
          ...styles.inputSearchStyle,
          color: colors.onSurface,
          borderWidth: 0,
          borderColor: dark ? "#2C2C2E" : "#2C2C2E",
        }}
        iconStyle={styles.iconStyle}
        data={data}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? placeholder : "..."}
        searchPlaceholder="Search..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          onChange(item.value);
          setIsFocus(false);
        }}
        renderLeftIcon={() => (
          <AntDesign
            style={styles.icon}
            color={isFocus ? colors.primary : colors.onSurface}
            name={iconName}
            size={20}
          />
        )}
        renderItem={(item, selected) => (
          <View
            style={{
              padding: 12,
              backgroundColor: selected ? colors.primary : colors.surface, // Normal background
            }}
          >
            <Text
              style={{
                color: colors.onSurface,
                fontSize: 16,
                fontWeight: selected ? "600" : "400",
              }}
            >
              {item.label}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export default AppDropdown;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  dropdown: {
    height: 56,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 12,
    justifyContent: "center",
  },
  icon: {
    marginRight: 8,
  },
  label: {
    position: "absolute",
    left: 12,
    top: 0,
    zIndex: 999,
    paddingHorizontal: 4,
    fontSize: 13,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    borderBottomWidth: 1,
  },
});
