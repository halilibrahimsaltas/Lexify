import React, { useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';

interface AlertProps {
  visible: boolean;
  title?: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  showIcon?: boolean;
  showCloseButton?: boolean;
  closeOnBackdropPress?: boolean;
  buttons?: Array<{
    text: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    iconName?: string;
    iconFamily?: string;
  }>;
  onClose?: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

const { width: screenWidth } = Dimensions.get('window');

const Alert: React.FC<AlertProps> = ({
  visible,
  title,
  message,
  type = 'info',
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
    let iconName = 'info';
    let iconColor = '#007AFF';
    switch (type) {
      case 'success':
        iconName = 'check-circle';
        iconColor = '#4CAF50';
        break;
      case 'error':
        iconName = 'error';
        iconColor = '#FF3B30';
        break;
      case 'warning':
        iconName = 'warning';
        iconColor = '#FF9800';
        break;
      case 'info':
      default:
        iconName = 'info';
        iconColor = '#007AFF';
        break;
    }
    return { iconName, iconColor };
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          container: styles.successContainer,
          title: styles.successTitle,
          icon: styles.successIcon,
        };
      case 'error':
        return {
          container: styles.errorContainer,
          title: styles.errorTitle,
          icon: styles.errorIcon,
        };
      case 'warning':
        return {
          container: styles.warningContainer,
          title: styles.warningTitle,
          icon: styles.warningIcon,
        };
      case 'info':
      default:
        return {
          container: styles.infoContainer,
          title: styles.infoTitle,
          icon: styles.infoIcon,
        };
    }
  };

  const getIconComponent = (family: string | undefined) => {
    switch (family) {
      case 'Feather':
        return Feather;
      case 'Ionicons':
        return Ionicons;
      case 'FontAwesome':
        return FontAwesome;
      case 'AntDesign':
        return AntDesign;
      case 'MaterialIcons':
      default:
        return MaterialIcons;
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={handleClose}>
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <View style={styles.overlay}>
          <Animated.View style={[styles.overlayBackground, { opacity: fadeAnim }]} />
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
                  {title && <Text style={[styles.title, typeStyles.title]}>{title}</Text>}
                  {showCloseButton && (
                    <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                      <MaterialIcons name="close" size={20} color="#666" />
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
                            button.variant === 'secondary' && styles.secondaryButton,
                            button.variant === 'outline' && styles.outlineButton,
                            index > 0 && styles.buttonMargin,
                          ]}
                          onPress={button.onPress}
                        >
                          {button.iconName && (
                            <IconComponent
                              name={button.iconName}
                              size={18}
                              color={
                                button.variant === 'secondary'
                                  ? '#5D4037'
                                  : button.variant === 'outline'
                                  ? '#007AFF'
                                  : '#fff'
                              }
                              style={{ marginRight: 6 }}
                            />
                          )}
                          <Text
                            style={[
                              styles.buttonText,
                              button.variant === 'secondary' && styles.secondaryButtonText,
                              button.variant === 'outline' && styles.outlineButtonText,
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
                  <TouchableOpacity style={styles.defaultButton} onPress={handleClose}>
                    <MaterialIcons name="check" size={18} color="#fff" style={{ marginRight: 6 }} />
                    <Text style={styles.defaultButtonText}>Tamam</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  overlayBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  alertContainer: {
    width: Math.min(screenWidth - 40, 400),
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  content: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    fontSize: 24,
    marginRight: 12,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5D4037',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEC84B',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    minWidth: 80,
  },
  secondaryButton: {
    backgroundColor: '#FAF3DD',
    borderWidth: 1,
    borderColor: '#bdbdbd',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  buttonMargin: {
    marginLeft: 12,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#5D4037',
  },
  outlineButtonText: {
    color: '#007AFF',
  },
  defaultButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEC84B',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  defaultButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  // Type-specific styles
  successContainer: {
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  successTitle: {
    color: '#2E7D32',
  },
  successIcon: {
    color: '#4CAF50',
  },
  errorContainer: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30',
  },
  errorTitle: {
    color: '#D32F2F',
  },
  errorIcon: {
    color: '#FF3B30',
  },
  warningContainer: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  warningTitle: {
    color: '#F57C00',
  },
  warningIcon: {
    color: '#FF9800',
  },
  infoContainer: {
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  infoTitle: {
    color: '#1976D2',
  },
  infoIcon: {
    color: '#007AFF',
  },
});

export default Alert;
