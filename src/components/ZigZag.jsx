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
      <circle cx="100" cy="50" r="19" fill="white" />
      <circle cx="106" cy="56" r="7.5" fill="black" />
      
      {/* Right eye */}
      <circle cx="160" cy="50" r="19" fill="white" />
      <circle cx="166" cy="56" r="7.5" fill="black" />
    </svg>
  );
}
