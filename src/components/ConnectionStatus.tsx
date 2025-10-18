interface ConnectionStatusProps {
  isConnected: boolean;
}

/**
 * A simple UI indicator that displays the current status of the WebSocket connection.
 * It shows a colored dot (green for connected, red for disconnected) and a text label.
 * @param {ConnectionStatusProps} props - The props for the component.
 */
export const ConnectionStatusIndicator = ({
  isConnected,
}: ConnectionStatusProps) => {
  const text = isConnected ? "Connected" : "Disconnected";
  const color = isConnected ? "bg-green-500" : "bg-red-500";

  return (
    <div className="p-4 bg-gray-50 rounded-lg border mt-auto">
      <div className="flex items-center gap-2">
        <span className={`w-3 h-3 rounded-full ${color}`}></span>
        <span className="font-semibold text-sm">
          Socket: <span className="font-normal">{text}</span>
        </span>
      </div>
    </div>
  );
};
