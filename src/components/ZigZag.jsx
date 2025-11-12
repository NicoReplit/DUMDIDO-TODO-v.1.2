export default function ZigZag() {
  return (
    <svg 
      width="260" 
      height="260" 
      viewBox="0 0 260 260" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M 45,90 L 85,190 L 130,50 L 175,190 L 215,110"
        stroke="#FF77B9"
        strokeWidth="60"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      
      {/* Left eye */}
      <circle cx="114.8" cy="50" r="15.2" fill="red" stroke="white" strokeWidth="3" filter="url(#shadow)" />
      <circle cx="119.8" cy="54.5" r="6" fill="black" />
      
      {/* Right eye */}
      <circle cx="145.2" cy="50" r="15.2" fill="red" stroke="white" strokeWidth="3" filter="url(#shadow)" />
      <circle cx="150.2" cy="54.5" r="6" fill="black" />
      
      <defs>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.2"/>
        </filter>
      </defs>
    </svg>
  );
}
