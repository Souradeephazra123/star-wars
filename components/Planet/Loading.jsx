export default function Loading() {
  return (
    // <div className="flex justify-center items-center h-screen">
    //   <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
    // </div>
    <div
      className="fixed"
      style={{ top: "calc(50% - 80px)", left: "calc(50% - 80px)" }}
    >
      <div
        className=" animate-spin h-40 w-40 border-[10px] border-solid  rounded-full "
        style={{
          border: "10px solid #f3f3f3",
          borderTop: "10px solid #3498db",
          borderRadius: "50%",
        }}
      ></div>
    </div>
  );
}
