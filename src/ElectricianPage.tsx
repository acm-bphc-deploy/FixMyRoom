import { useState } from "react";

export default function ElectricianPage() {
  const [hostel, setHostel] = useState("VK");
  const [roomNo, setRoomNo] = useState("");
  const [description, setDescription] = useState("");
  const [suggestedTime, setSuggestedTime] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ hostel, roomNo, description, suggestedTime });
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Electrician Request</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Hostel</label>
          <select
            className="w-full border p-2 rounded"
            value={hostel}
            onChange={(e) => setHostel(e.target.value)}
          >
            <option value="VK">VK</option>
            <option value="VM">VM</option>
            <option value="Malaivya">Malaivya</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold">Room No</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={roomNo}
            onChange={(e) => setRoomNo(e.target.value)}
            placeholder="Enter room number"
          />
        </div>

        <div>
          <label className="block font-semibold">Description</label>
          <textarea
            className="w-full border p-2 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the issue"
          />
        </div>

        <div>
          <label className="block font-semibold">Suggested Time</label>
          <input
            type="time"
            className="w-full border p-2 rounded"
            value={suggestedTime}
            onChange={(e) => setSuggestedTime(e.target.value)}
          />
        </div>

        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
          Submit Request
        </button>
      </form>
    </div>
  );
}
