const StyleDropdown = ({ value, onChange }) => (
  <div>
    <label
      htmlFor="lumiai-style"
      className="text-md font-semibold mb-2 block text-[#0D1B2A]"
    >
      Art Style
    </label>
    <select
      id="lumiai-style"
      value={value}
      onChange={onChange}
      className="w-full p-3 border border-gray-300 rounded-lg bg-white text-[#0D1B2A] focus:ring-2 focus:ring-[#00E5A0] focus:border-transparent transition"
    >
      <option value="analog-film">Analog Film</option>
      <option value="anime">Anime</option>
      <option value="cinematic">Cinematic</option>
      <option value="comic-book">Comic Book</option>
      <option value="digital-art">Digital Art</option>
    </select>
  </div>
);

export default StyleDropdown;
