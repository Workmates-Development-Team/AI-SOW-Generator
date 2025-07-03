import React from 'react';

interface SOWDateSectionProps {
  sowDate?: string;
  style?: React.CSSProperties;
}

const SOWDateSection: React.FC<SOWDateSectionProps> = ({ sowDate }) => {
  const displaySowDate = React.useMemo(() => {
    if (sowDate) {
      const date = new Date(sowDate);
      const locale = 'en-IN';
      const dayMonthOptions: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', timeZone: 'Asia/Kolkata' };
      const yearOptions: Intl.DateTimeFormatOptions = { year: 'numeric', timeZone: 'Asia/Kolkata' };
      return {
        dayMonth: new Intl.DateTimeFormat(locale, dayMonthOptions).format(date),
        year: new Intl.DateTimeFormat(locale, yearOptions).format(date),
      };
    }
    return { dayMonth: '', year: '' };
  }, [sowDate]);

  if (!displaySowDate.dayMonth && !displaySowDate.year) return null;
  return (
    <div style={{
      position: 'absolute',
      top: '67%',
      right: '5%',
      fontSize: '1.4rem',
      lineHeight: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      zIndex: 10,
    }}>
      <span style={{ fontWeight: 400 }}>{displaySowDate.dayMonth}</span>
      <span style={{ fontWeight: 700, color: 'red' }}>{displaySowDate.year}</span>
    </div>
  );
};

export default SOWDateSection;
export { SOWDateSection }; 