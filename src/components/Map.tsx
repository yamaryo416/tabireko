"use client"

import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api"
import { useMap } from "@/hooks/use-map"
import { SearchLocation } from "./SearchLocation"
import { FilterTag } from "./FilterTag"
import { MarkerCreateModal } from "./MarkerCreateModal"
import { TagCreateModal } from "./TagCreateModal"
import { MarkerDetailModal } from "./MarkerDetailModal"
import { FlashMessage } from "./FlashMessage"
import { useState } from "react"
import { MarkerEditModal } from "./MarkerEditModal"

export const defaultMapContainerStyle = {
  width: "100%",
  height: "70vh",
  borderRadius: "15px 0px 0px 15px",
}

const defaultMapOptions: google.maps.MapOptions = {
  zoomControl: true,
  tilt: 0,
  gestureHandling: "greedy",
  mapTypeId: "roadmap",
}

export const Map = () => {
  const {
    zoom,
    loading,
    flash,
    centerLocation,
    searchWord,
    searchSuggestList,
    tagList,
    isOpenFilterTagModal,
    filterTagIds,
    markerList,
    isOpenCreateTagModal,
    isOpenCreateMarkerModal,
    newMarker,
    newTag,
    iconList,
    isOpenDetailModal,
    selectedMarker,
    selectedMarkerImgs,
    isOpenEditMarkerModal,
    editMarker,
    setFlash,
    setFilterTagIds,
    setSelectedMarker,
    onClickCurrentLoaction,
    setMarkerList,
    onSearchLocation,
    onClickSearchLocation,
    onOpenFilterTagModal,
    onCloseFilterTagModal,
    toggleFilterTagIds,
    openCreateMarkerModal,
    markerFilter,
    onOpenDetailMarker,
    onOpenCreateTagModal,
    onCloseCreateTagModal,
    onCloseCreateMarkerModal,
    changeNewMarker,
    changeDatetime,
    handleUploadImg,
    handleCreateMarker,
    changeNewTag,
    handleCreateTag,
    onCloseDetailModal,
    onOpenEditMarker,
    changeEditMarker,
    changeEditDatetime,
    handleEditMarker,
    removeImage,
    onCloseEditMarkerModal,
  } = useMap()

  const [isDisplayBaloon, setIsDisplayBaloon] = useState(true)

  return (
    <div className="fixed left-0 top-[57px] w-full">
      <FlashMessage flash={flash} setFlash={setFlash} />
      <SearchLocation
        searchWord={searchWord}
        searchSuggestList={searchSuggestList}
        onClickSearchLocation={onClickSearchLocation}
        onSearchLocation={onSearchLocation}
      />
      <FilterTag
        isDisplayBaloon={isDisplayBaloon}
        tagList={tagList}
        isOpenFilterTagModal={isOpenFilterTagModal}
        filterTagIds={filterTagIds}
        setIsDisplayBaloon={setIsDisplayBaloon}
        setFilterTagIds={setFilterTagIds}
        onOpenFilterTagModal={onOpenFilterTagModal}
        toggleFilterTagIds={toggleFilterTagIds}
        onCloseFilterTagModal={onCloseFilterTagModal}
      />
      <div className="relative">
        <GoogleMap
          mapContainerStyle={defaultMapContainerStyle}
          center={centerLocation}
          zoom={zoom}
          options={defaultMapOptions}
          onClick={openCreateMarkerModal}
        >
          {markerList.filter(markerFilter).map((marker) => (
            <Marker
              key={marker.id}
              position={{ lat: marker.lat, lng: marker.lng }}
              icon={
                marker.tag && marker.tag.icon
                  ? marker.tag.icon.url
                  : "https://maps.google.com/mapfiles/kml/paddle/O.png"
              }
              onClick={(_) => onOpenDetailMarker(marker)}
            >
              {isDisplayBaloon && (
                <InfoWindow position={{ lat: marker.lat, lng: marker.lng }}>
                  <button onClick={() => onOpenDetailMarker(marker)}>
                    {marker.title}
                  </button>
                </InfoWindow>
              )}
            </Marker>
          ))}
        </GoogleMap>
        <button
          type="button"
          className="absolute z-10020 bottom-[20px] left-[10px] bg-white p-2.5"
          onClick={onClickCurrentLoaction}
        >
          現在地
        </button>
      </div>
      <MarkerCreateModal
        loading={loading}
        isOpenCreateMarkerModal={isOpenCreateMarkerModal}
        newMarker={newMarker}
        tagList={tagList}
        onOpenCreateTagModal={onOpenCreateTagModal}
        onCloseCreateMarkerModal={onCloseCreateMarkerModal}
        changeNewMarker={changeNewMarker}
        changeDatetime={changeDatetime}
        handleUploadImg={handleUploadImg}
        handleCreateMarker={handleCreateMarker}
      />
      <TagCreateModal
        newTag={newTag}
        isOpenCreateTagModal={isOpenCreateTagModal}
        iconList={iconList}
        onCloseCreateTagModal={onCloseCreateTagModal}
        handleCreateTag={handleCreateTag}
        changeNewTag={changeNewTag}
      />
      <MarkerDetailModal
        selectedMarker={selectedMarker}
        selectedMarkerImgs={selectedMarkerImgs}
        setSelectedMarker={setSelectedMarker}
        setMarkerList={setMarkerList}
        setFlash={setFlash}
        isOpenDetailModal={isOpenDetailModal}
        onCloseDetailModal={onCloseDetailModal}
        onOpenEditMarker={onOpenEditMarker}
      />
      <MarkerEditModal
        loading={loading}
        isOpen={isOpenEditMarkerModal}
        editMarker={editMarker}
        tagList={tagList}
        onOpenCreateTagModal={onOpenCreateTagModal}
        onClose={onCloseEditMarkerModal}
        changeEditMarker={changeEditMarker}
        changeDatetime={changeEditDatetime}
        handleUploadImg={handleUploadImg}
        removeImage={removeImage}
        handleEdit={handleEditMarker}
      />
    </div>
  )
}
