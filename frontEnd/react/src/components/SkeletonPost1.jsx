// SkeletonPost.jsx
const SkeletonPost1 = ({ changetheme }) => {
    return (
      <div
        className={`animate-pulse h-[438px] w-[300px] 
          ${changetheme 
            ? "bg-[#000000d1] shadow-[0px_0px_1px_1px_#00ced15c]" 
            : "bg-[#f5f5f587] shadow-[0px_0px_6px_0px_#00000038]"} 
          rounded-[8px] p-2`}
      >
        <div className="bg-gray-300 h-[300px] w-full rounded mb-2" />
        <div className="bg-gray-300 h-[10px] w-[200px] rounded mt-2" />
        <div className="bg-gray-300 h-[10px] w-[180px] rounded mt-2" />
        <div className="bg-gray-300 h-[15px] w-[160px] rounded mt-2" />

        <div className="bg-gray-300 h-[10px] w-[180px] rounded mt-2" />
        <div className="bg-gray-300 h-[15px] w-[200px] rounded mt-2" />
        <div className="bg-gray-300 h-[18px] w-[285px] rounded mt-2" />
      </div>
    );
  };
  
  export default SkeletonPost1;
  