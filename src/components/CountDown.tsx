import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Vibration,
} from 'react-native';

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Start countdown when running
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  useEffect(() => {
    if (timeLeft === 0 && hasStarted) {
      setIsRunning(false);
      Vibration.vibrate(1000);
    }
  }, [timeLeft]);

  // Format time as HH : MM : SS
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return {
      hrs: String(hrs).padStart(2, '0'),
      mins: String(mins).padStart(2, '0'),
      secs: String(secs).padStart(2, '0'),
    };
  };

  const setTimer = (minutes: number) => {
    setTimeLeft(minutes * 60);
    setIsRunning(true);
    setHasStarted(true);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(0);
    setHasStarted(false); // go back to selection screen
  };

  const { hrs, mins, secs } = formatTime(timeLeft);

  return (
    <View style={styles.container}>
      <View style={styles.timerBox}>
        {!hasStarted ? (
          // Show options before countdown starts
          <>
            <View style={styles.countdownRow}>
              <Text style={styles.label}>Set Timer</Text>
              <View style={styles.optionsRow}>
                {[30, 60, 90, 120].map(min => (
                  <TouchableOpacity
                    key={min}
                    style={styles.circleButton}
                    onPress={() => setTimer(min)}
                  >
                    <Text style={styles.circleText}>{min}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        ) : (
          // Show countdown after selecting time
          <>
            <View style={styles.countdownRow}>
              <Text style={styles.label}>Countdown</Text>
              <View style={styles.optionsRow}>
                <View style={styles.timeBlock}>
                  <Text style={styles.timeText}>{hrs}</Text>
                  <Text style={styles.subText}>Hours</Text>
                </View>
                <Text style={styles.colon}>:</Text>
                <View style={styles.timeBlock}>
                  <Text style={styles.timeText}>{mins}</Text>
                  <Text style={styles.subText}>Minutes</Text>
                </View>
                <Text style={styles.colon}>:</Text>
                <View style={styles.timeBlock}>
                  <Text style={styles.timeText}>{secs}</Text>
                  <Text style={styles.subText}>Seconds</Text>
                </View>
                {/* Controls */}
                <View style={styles.controls}>
                  <TouchableOpacity
                    disabled={timeLeft === 0} // disable when timer ends
                    onPress={() => setIsRunning(prev => !prev)} // toggle pause/resume
                  >
                    <Text style={styles.controlText}>
                      {isRunning ? 'Pause' : 'Resume'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={resetTimer}>
                    <Text style={styles.controlText}>Reset</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    marginTop: 20,
  },

  timerBox: {
    // flex: 1,
    // padding: 10,
    justifyContent: 'space-between', // space out evenly
    flexDirection: 'row',
    backgroundColor: '#5D4A99',
    padding: 20,
    borderRadius: 10,
    // marginVertical: 10,
    // width: 320,
    alignItems: 'center',
    gap: 10,
  },

  label: {
    color: '#fff',
    fontWeight: '600',
    marginBottom: 10,
  },

  optionsRow: {
    flexDirection: 'row',
    width: '90%',
    gap: 20,
    paddingHorizontal: 10,
  },

  circleButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  circleText: {
    fontWeight: 'bold',
    fontSize: 15,
  },

  countdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
  },

  timeBlock: {
    alignItems: 'center',
  },

  timeText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },

  subText: {
    color: '#ddd',
    fontSize: 10,
  },

  colon: {
    color: '#fff',
    fontSize: 22,
    marginHorizontal: 4,
  },

  controls: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 15,
  },

  controlText: {
    color: '#fff',
    fontWeight: '500',
  },
});

export default CountdownTimer;
