import React, { useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useLanguage } from "../contexts/LanguageContext";

interface AlertProps {
  visible: boolean;
  title?: string;
  message: string;
  type?: "primary" | "secondary";
  showIcon?: boolean;
  showCloseButton?: boolean;
  closeOnBackdropPress?: boolean;
  buttons?: Array<{
    text: string;
    onPress: () => void;
    variant?: "primary" | "secondary";
    iconName?: string;
    iconFamily?: string;
  }>;
  onClose?: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

const { width: screenWidth } = Dimensions.get("window");

const Alert: React.FC<AlertProps> = ({
  visible,
  title,
  message,
  type = "primary",
  showIcon = true,
  showCloseButton = true,
  closeOnBackdropPress = true,
  buttons,
  onClose,
  autoClose = false,
  autoCloseDelay = 3000,
}) => {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);
  const { t } = useLanguage();

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();

      if (autoClose) {
        const timer = setTimeout(() => {
          handleClose();
        }, autoCloseDelay);

        return () => clearTimeout(timer);
      }
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleBackdropPress = () => {
    if (closeOnBackdropPress) {
      handleClose();
    }
  };

  const getIcon = () => {
    let iconName = "info";
    let iconColor = "#32341f"; // koyu yeşil
    if (type === "primary") {
      iconName = "check-circle";
      iconColor = "#32341f";
    } else {
      iconName = "info";
      iconColor = "#4B3F2F"; // koyu kahverengi
    }
    return { iconName, iconColor };
  };

  const getTypeStyles = () => {
    if (type === "primary") {
      return {
        container: styles.primaryContainer,
        title: styles.primaryTitle,
        icon: styles.primaryIcon,
      };
    } else {
      return {
        container: styles.secondaryContainer,
        title: styles.secondaryTitle,
        icon: styles.secondaryIcon,
      };
    }
  };

  const getIconComponent = (family: string | undefined) => {
    switch (family) {
      case "Feather":
        return Feather;
      case "Ionicons":
        return Ionicons;
      case "FontAwesome":
        return FontAwesome;
      case "AntDesign":
        return AntDesign;
      case "MaterialIcons":
      default:
        return MaterialIcons;
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <View style={styles.overlay}>
          <Animated.View
            style={[styles.overlayBackground, { opacity: fadeAnim }]}
          />
          <Animated.View
            style={[
              styles.alertContainer,
              typeStyles.container,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <TouchableWithoutFeedback>
              <View style={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                  {showIcon && (
                    <MaterialIcons
                      name={getIcon().iconName}
                      size={28}
                      color={getIcon().iconColor}
                      style={[styles.icon, typeStyles.icon]}
                    />
                  )}
                  {title && (
                    <Text style={[styles.title, typeStyles.title]}>
                      {title}
                    </Text>
                  )}
                  {showCloseButton && (
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={handleClose}
                    >
                      <MaterialIcons name="close" size={20} color="#4E2B1B" />
                    </TouchableOpacity>
                  )}
                </View>

                {/* Message */}
                <Text style={styles.message}>{message}</Text>

                {/* Buttons */}
                {buttons && buttons.length > 0 && (
                  <View style={styles.buttonContainer}>
                    {buttons.map((button, index) => {
                      const IconComponent = getIconComponent(button.iconFamily);
                      return (
                        <TouchableOpacity
                          key={index}
                          style={[
                            styles.button,
                            button.variant === "secondary" &&
                              styles.secondaryButton,
                            index > 0 && styles.buttonMargin,
                          ]}
                          onPress={button.onPress}
                        >
                          {button.iconName && (
                            <IconComponent
                              name={button.iconName}
                              size={18}
                              color={
                                button.variant === "secondary"
                                  ? "#4B3F2F"
                                  : "#FFF8E1"
                              }
                              style={{ marginRight: 6 }}
                            />
                          )}
                          <Text
                            style={[
                              styles.buttonText,
                              button.variant === "secondary" &&
                                styles.secondaryButtonText,
                            ]}
                          >
                            {button.text}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}

                {/* Default button */}
                {(!buttons || buttons.length === 0) && (
                  <TouchableOpacity
                    style={styles.defaultButton}
                    onPress={handleClose}
                  >
                    <MaterialIcons
                      name="check"
                      size={18}
                      color="#FFF8E1"
                      style={{ marginRight: 6 }}
                    />
                    <Text style={styles.defaultButtonText}>{t("ok")}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </TouchableWithoutFeedback>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  overlayBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  alertContainer: {
    width: Math.min(screenWidth - 40, 400),
    borderRadius: 16,
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  content: {
    padding: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  icon: {
    fontSize: 24,
    marginRight: 12,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: "bold",
    color: "#4B3F2F",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  message: {
    fontSize: 16,
    color: "#4E2B1B",
    lineHeight: 24,
    marginBottom: 24,
    fontFamily: "Roboto_400Regular",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#32341f",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    minWidth: 80,
  },
  secondaryButton: {
    backgroundColor: "#FFF8E1",
    borderWidth: 1,
    borderColor: "#32341f",
  },
  buttonMargin: {
    marginLeft: 12,
  },
  buttonText: {
    color: "#FFF8E1",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Roboto_500Medium",
  },
  secondaryButtonText: {
    color: "#4B3F2F",
    fontFamily: "Roboto_500Medium",
  },
  defaultButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#32341f",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  defaultButtonText: {
    color: "#FFF8E1",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Roboto_500Medium",
  },
  // Type-specific styles (sadeleştirilmiş)
  primaryContainer: {
    backgroundColor: "#FFF8E1",
    borderLeftWidth: 4,
    borderLeftColor: "#32341f",
  },
  primaryTitle: {
    color: "#32341f",
  },
  primaryIcon: {
    color: "#32341f",
  },
  secondaryContainer: {
    backgroundColor: "#FAFAFA",
    borderLeftWidth: 4,
    borderLeftColor: "#4B3F2F",
  },
  secondaryTitle: {
    color: "#4B3F2F",
  },
  secondaryIcon: {
    color: "#4B3F2F",
  },
});

export default Alert;
