"use client";

import React from 'react';
import styles from './JaggeryLoader.module.css';

const JaggeryLoader: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.labelWrapper}>
        <div className={styles.labelLineWrapper}>
          <div 
            style={{ 
              width: '28px', 
              height: '1px', 
              background: 'linear-gradient(to right, transparent, #c9843e)' 
            }} 
          />
          <div className={styles.dotGroup}>
            <div className={styles.dot} style={{ animationDelay: '0s' }}></div>
            <div className={styles.dot} style={{ animationDelay: '0.25s' }}></div>
            <div className={styles.dot} style={{ animationDelay: '0.5s' }}></div>
          </div>
          <div 
            style={{ 
              width: '28px', 
              height: '1px', 
              background: 'linear-gradient(to left, transparent, #c9843e)' 
            }} 
          />
        </div>
        <span className={styles.loadingLabel}>Loading</span>
      </div>
    </div>
  );
};

export default JaggeryLoader;
