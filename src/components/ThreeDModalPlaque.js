import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  Animated,
  Pressable,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThreeDPauseBadge, ThreeDTrophy } from './ThreeDIcons.js';
import { SvgTarget, SvgFlash, SvgClose } from './SvgIcons.js';

/**
 * Animated glass modal shell shared by pause, completion, rules, and warning dialogs.
 */
export function ThreeDModalPlaque({
  visible,
  onClose,
  crestType = 'pause', // 'pause' | 'trophy' | 'rules' | 'warning'
  title = 'PAUSED',
  subtitle = 'Current operations suspended',
  children,
  maxWidth = 360,
  showClose = false,
}) {
  const { width, height } = useWindowDimensions();
  const effectiveMaxWidth = Math.min(width - 32, maxWidth);

  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      scaleAnim.setValue(0.8);
      opacityAnim.setValue(0);
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          speed: 18,
          bounciness: 9,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, scaleAnim, opacityAnim]);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        {/* Animated 3D Plaque Container */}
        <Animated.View
          style={[
            styles.plaqueOuter,
            {
              maxWidth: effectiveMaxWidth,
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          {/* Deep 3D Extrusion Shadow Rim */}
          <View style={styles.plaqueShadowBase} />

          <LinearGradient
            colors={['#17243B', '#0B1426']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.woodenFrame}
          >
            <View style={styles.frameTopSheen} />

            <LinearGradient
              colors={['rgba(15, 23, 42, 0.96)', 'rgba(7, 13, 26, 0.98)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={[styles.innerInlay, { maxHeight: Math.floor(height * 0.8) }]}
            >
              <View style={styles.innerGrooveBorder} />

              <ScrollView
                showsVerticalScrollIndicator={false}
                bounces={false}
                contentContainerStyle={styles.scrollBody}
              >
                <View style={styles.titleSection}>
                  <View style={styles.titleExtrusionContainer}>
                    <Text style={styles.title3dShadow}>{title}</Text>
                    <Text style={styles.title3dFront}>{title}</Text>
                  </View>

                  {subtitle ? (
                    <Text style={styles.subtitleText}>{subtitle}</Text>
                  ) : null}
                </View>

                <View style={styles.contentBody}>{children}</View>
              </ScrollView>
            </LinearGradient>
          </LinearGradient>

          {/* Top Overlapping Crest Medallion */}
          <View style={styles.topCrestWrapper} pointerEvents="box-none">
            {crestType === 'pause' && <ThreeDPauseBadge size={58} />}
            {crestType === 'trophy' && <ThreeDTrophy size={54} />}
            {crestType === 'rules' && (
              <View style={styles.rulesCrest}>
                <LinearGradient
                  colors={['#38D9F8', '#0FB7E8', '#0288D1']}
                  style={styles.crestCircle}
                >
                  <SvgTarget size={30} color="#FFFFFF" />
                </LinearGradient>
              </View>
            )}
            {crestType === 'warning' && (
              <View style={styles.warningCrest}>
                <LinearGradient
                  colors={['#FF6B8B', '#FF2A6D', '#B80D3A']}
                  style={styles.crestCircle}
                >
                  <SvgFlash size={28} color="#FFFFFF" />
                </LinearGradient>
              </View>
            )}
          </View>

          {/* Optional Close Button */}
          {showClose && (
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <SvgClose size={20} color="#FFFFFF" />
            </Pressable>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(2, 6, 23, 0.78)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  plaqueOuter: {
    width: '100%',
    position: 'relative',
    marginTop: 24,
    maxHeight: '94%',
  },
  plaqueShadowBase: {
    position: 'absolute',
    top: 6,
    left: 4,
    right: 4,
    bottom: -6,
    borderRadius: 24,
    backgroundColor: '#020617',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.65,
    shadowRadius: 14,
    elevation: 12,
  },
  woodenFrame: {
    borderRadius: 26,
    borderWidth: 1,
    borderColor: 'rgba(125, 211, 252, 0.3)',
    padding: 8,
    position: 'relative',
    overflow: 'visible',
  },
  frameTopSheen: {
    position: 'absolute',
    top: 2,
    left: 20,
    right: 20,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderRadius: 1,
  },
  innerInlay: {
    borderRadius: 20,
    paddingTop: 38,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.16)',
    position: 'relative',
    overflow: 'hidden',
  },
  innerGrooveBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  topCrestWrapper: {
    position: 'absolute',
    top: -26,
    alignSelf: 'center',
    zIndex: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 10,
  },
  crestCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  rulesCrest: {
    width: 58,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
  },
  warningCrest: {
    width: 58,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 14,
  },
  titleExtrusionContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title3dShadow: {
    position: 'absolute',
    top: 2.5,
    fontSize: 22,
    fontWeight: '900',
    color: '#075985',
    letterSpacing: 1.2,
  },
  title3dFront: {
    fontSize: 22,
    fontWeight: '900',
    color: '#F8FAFC',
    letterSpacing: 1.2,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subtitleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    marginTop: 3,
    letterSpacing: 0.4,
  },
  scrollBody: {
    flexGrow: 0,
  },
  contentBody: {
    width: '100%',
  },
  closeBtn: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E62E5C',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 6,
  },
});
