import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  Animated,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ThreeDPauseBadge, ThreeDTrophy } from './ThreeDIcons.js';

/**
 * 3D Cartoon Wooden Gaming Plaque with metallic corner brackets,
 * screw rivets, decorative moss sprigs, top crest medallion, and 3D extruded title.
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
              maxWidth,
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          {/* Deep 3D Extrusion Shadow Rim */}
          <View style={styles.plaqueShadowBase} />

          {/* Main Wooden Board Face */}
          <LinearGradient
            colors={['#6B3819', '#54290F', '#3D1A08']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.woodenFrame}
          >
            {/* Top Gloss Highlight Edge */}
            <View style={styles.frameTopSheen} />

            {/* Inner Recessed Wooden Inlay */}
            <LinearGradient
              colors={['#421E0B', '#341505', '#240C02']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.innerInlay}
            >
              {/* Inner Groove Shadow */}
              <View style={styles.innerGrooveBorder} />

              {/* Title Section (with space for top crest) */}
              <View style={styles.titleSection}>
                <View style={styles.titleExtrusionContainer}>
                  {/* Extruded 3D Text Shadow */}
                  <Text style={styles.title3dShadow}>{title}</Text>
                  {/* Front Golden 3D Title */}
                  <Text style={styles.title3dFront}>{title}</Text>
                </View>

                {subtitle ? (
                  <Text style={styles.subtitleText}>{subtitle}</Text>
                ) : null}
              </View>

              {/* Plaque Content */}
              <View style={styles.contentBody}>{children}</View>
            </LinearGradient>

            {/* 4 Silver Corner Metal Brackets with Screw Rivets */}
            {/* Top-Left Bracket */}
            <View style={[styles.cornerBracket, styles.topLeftBracket]}>
              <View style={styles.rivetDot} />
            </View>

            {/* Top-Right Bracket */}
            <View style={[styles.cornerBracket, styles.topRightBracket]}>
              <View style={styles.rivetDot} />
            </View>

            {/* Bottom-Left Bracket */}
            <View style={[styles.cornerBracket, styles.bottomLeftBracket]}>
              <View style={styles.rivetDot} />
            </View>

            {/* Bottom-Right Bracket */}
            <View style={[styles.cornerBracket, styles.bottomRightBracket]}>
              <View style={styles.rivetDot} />
            </View>

            {/* Decorative Green Moss / Vine Sprigs (Matching Reference Image 1) */}
            <View style={styles.mossSprigTopLeft} pointerEvents="none">
              <View style={[styles.mossDot, { width: 14, height: 7, borderRadius: 4 }]} />
              <View style={[styles.mossDot, { width: 10, height: 5, borderRadius: 3, marginTop: -2 }]} />
            </View>

            <View style={styles.mossSprigBottomRight} pointerEvents="none">
              <View style={[styles.mossDot, { width: 12, height: 6, borderRadius: 4 }]} />
              <View style={[styles.mossDot, { width: 8, height: 4, borderRadius: 3, marginTop: -1 }]} />
            </View>
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
                  <Ionicons name="navigate-circle" size={32} color="#FFFFFF" />
                </LinearGradient>
              </View>
            )}
            {crestType === 'warning' && (
              <View style={styles.warningCrest}>
                <LinearGradient
                  colors={['#FF6B8B', '#FF2A6D', '#B80D3A']}
                  style={styles.crestCircle}
                >
                  <Ionicons name="warning" size={30} color="#FFFFFF" />
                </LinearGradient>
              </View>
            )}
          </View>

          {/* Optional Close Button */}
          {showClose && (
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#FFFFFF" />
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
    backgroundColor: 'rgba(3, 6, 16, 0.82)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  plaqueOuter: {
    width: '100%',
    position: 'relative',
    marginTop: 20,
  },
  plaqueShadowBase: {
    position: 'absolute',
    top: 6,
    left: 4,
    right: 4,
    bottom: -6,
    borderRadius: 24,
    backgroundColor: '#0C0603',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.65,
    shadowRadius: 14,
    elevation: 12,
  },
  woodenFrame: {
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#7F4522',
    padding: 8,
    position: 'relative',
    overflow: 'visible',
  },
  frameTopSheen: {
    position: 'absolute',
    top: 2,
    left: 20,
    right: 20,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 3,
  },
  innerInlay: {
    borderRadius: 18,
    paddingTop: 34,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: '#2D1205',
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
    color: '#8F4A00',
    letterSpacing: 1.2,
  },
  title3dFront: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFF2C6',
    letterSpacing: 1.2,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subtitleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D4B59D',
    marginTop: 3,
    letterSpacing: 0.4,
  },
  contentBody: {
    width: '100%',
  },
  // 4 Metallic Corner Brackets with Rivets
  cornerBracket: {
    position: 'absolute',
    width: 22,
    height: 22,
    backgroundColor: '#9AA7B5',
    borderWidth: 1.5,
    borderColor: '#D8E2EC',
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topLeftBracket: {
    top: -2,
    left: -2,
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 4,
  },
  topRightBracket: {
    top: -2,
    right: -2,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 4,
  },
  bottomLeftBracket: {
    bottom: -2,
    left: -2,
    borderBottomLeftRadius: 10,
    borderTopRightRadius: 4,
  },
  bottomRightBracket: {
    bottom: -2,
    right: -2,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 4,
  },
  rivetDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#4B5563',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  // Decorative Moss Sprigs
  mossSprigTopLeft: {
    position: 'absolute',
    top: -5,
    left: 20,
    zIndex: 11,
  },
  mossSprigBottomRight: {
    position: 'absolute',
    bottom: -4,
    right: 20,
    zIndex: 11,
  },
  mossDot: {
    backgroundColor: '#74A824',
    borderWidth: 1,
    borderColor: '#4E7514',
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
