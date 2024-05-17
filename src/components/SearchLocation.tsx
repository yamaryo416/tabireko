import { ChangeEvent, useState } from "react";

type PropsType = {
  searchWord: string;
  searchSuggestList: google.maps.GeocoderResult[];
  onSearchLocation: (e: ChangeEvent<HTMLInputElement>) => void;
  onClickSearchLocation: (result: google.maps.GeocoderResult) => void;
};

export const SearchLocation = ({
  searchWord,
  searchSuggestList,
  onSearchLocation,
  onClickSearchLocation,
}: PropsType) => {
  return (
    <div className="flex justify-between mb-3 relative">
      <input
        value={searchWord}
        onChange={onSearchLocation}
        className="bg-white sm:w-[200px] w-[100%] h-[30px] border border-amber-700 p-2"
      />
      {searchSuggestList.length !== 0 && (
        <div className="absolute top-[30px] left-0 z-[10000] w-full">
          {searchSuggestList.map((item) => (
            <button
              key={item.place_id}
              className="bg-white border border-solid border-amber-700 w-full"
              onClick={() => onClickSearchLocation(item)}
            >
              {item.formatted_address}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
