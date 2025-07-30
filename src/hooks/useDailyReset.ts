/**
 * Daily Reset Hook - DISABLED
 * 
 * This hook was previously causing automatic resets on page reload.
 * It has been disabled to prevent unwanted automatic status changes.
 * 
 * Use the manual "Resetear Estado" button in Student Management instead.
 */

import { useEffect } from 'react';
import { useData } from '@/contexts/DataContext';

export const useDailyReset = () => {
  const { resetDailyStatus } = useData();

  useEffect(() => {
    // DISABLED: Automatic reset functionality has been intentionally disabled
    // to prevent unwanted status changes on page reload.
    
    console.log('⚠️ useDailyReset hook loaded but automatic reset is DISABLED');
    console.log('💡 Use the manual "Resetear Estado" button in Student Management instead');
    
    // The original automatic reset code has been commented out:
    /*
    const checkAndReset = async () => {
      const today = new Date().toISOString().split('T')[0];
      const lastReset = localStorage.getItem('lastDailyReset');
      
      if (lastReset !== today) {
        console.log('🔄 Ejecutando reset diario automático...', {
          date: today,
          lastReset,
          timestamp: new Date().toISOString()
        });
        
        try {
          await resetDailyStatus();
          localStorage.setItem('lastDailyReset', today);
          
          console.log('✅ Reset diario completado exitosamente', {
            date: today,
            timestamp: new Date().toISOString()
          });
        } catch (error) {
          console.error('❌ Error en reset diario automático:', error);
        }
      }
    };
    
    checkAndReset();
    */
    
  }, [resetDailyStatus]);

  // Return empty object to maintain compatibility
  return {};
};

export default useDailyReset;
