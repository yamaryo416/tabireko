"use client"

import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api"
import { useMap } from "@/hooks/use-map"
import { FilterTag } from "./FilterTag"
import { MarkerCreateModal } from "./MarkerCreateModal"
import { TagCreateModal } from "./TagCreateModal"
import { MarkerDetailModal } from "./MarkerDetailModal"
import { FlashMessage } from "./FlashMessage"
import { MarkerEditModal } from "./MarkerEditModal"
import Image from "next/image"

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
    displayMode,
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
    allImgList,
    eachImgList,
    isOpenCreateTagModal,
    isOpenCreateMarkerModal,
    newMarker,
    newTag,
    iconList,
    isOpenDetailModal,
    selectedMarker,
    selectedMarkerImgs,
    selectedMarkerOfficialImgs,
    isOpenEditMarkerModal,
    isOpenSearchLocationFromImgModal,
    editMarker,
    isOpenCalendarModal,
    onOpenCalendarModal,
    onCloseCalendarModal,
    setDisplayMode,
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
    onOpenSearchLocationFromImgModal,
    onCloseSearchLocationFromImgModal,
    onClickSearchLocationFromImg,
    isOpenSearchLocationModal,
    onOpenSearchLocationModal,
    onCloseSearchLocationModal,
  } = useMap()

  return (
    <div className="fixed left-0 top-0 w-full">
      <FlashMessage flash={flash} setFlash={setFlash} />
      <FilterTag
        displayMode={displayMode}
        tagList={tagList}
        isOpenFilterTagModal={isOpenFilterTagModal}
        filterTagIds={filterTagIds}
        allImgList={allImgList}
        isOpenSearchLocationFromImgModal={isOpenSearchLocationFromImgModal}
        markerList={markerList}
        isOpenCalendarModal={isOpenCalendarModal}
        onOpenCalendarModal={onOpenCalendarModal}
        onCloseCalendarModal={onCloseCalendarModal}
        setDisplayMode={setDisplayMode}
        setFilterTagIds={setFilterTagIds}
        onOpenFilterTagModal={onOpenFilterTagModal}
        toggleFilterTagIds={toggleFilterTagIds}
        onCloseFilterTagModal={onCloseFilterTagModal}
        onClickSearchLocationFromImg={onClickSearchLocationFromImg}
        onOpenSearchLocationFromImgModal={onOpenSearchLocationFromImgModal}
        onCloseSearchLocationFromImgModal={onCloseSearchLocationFromImgModal}
        searchWord={searchWord}
        searchSuggestList={searchSuggestList}
        isOpenSearchLocationModal={isOpenSearchLocationModal}
        onClickSearchLocation={onClickSearchLocation}
        onSearchLocation={onSearchLocation}
        onOpenSearchLocationModal={onOpenSearchLocationModal}
        onCloseSearchLocationModal={onCloseSearchLocationModal}
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
              {displayMode === "balloon" && (
                <InfoWindow position={{ lat: marker.lat, lng: marker.lng }}>
                  <button onClick={() => onOpenDetailMarker(marker)}>
                    {marker.title}
                  </button>
                </InfoWindow>
              )}
              {displayMode === "img" && (
                <InfoWindow position={{ lat: marker.lat, lng: marker.lng }}>
                  <button onClick={() => onOpenDetailMarker(marker)}>
                    {eachImgList[marker.id] == null ? (
                      "画像なし"
                    ) : (
                      <Image
                        alt="その地点の画像"
                        src={eachImgList[marker.id]}
                        width={50}
                        height={50}
                      />
                    )}
                  </button>
                </InfoWindow>
              )}
            </Marker>
          ))}
        </GoogleMap>
        <button
          type="button"
          className="absolute bottom-[20px] left-[10px] bg-white p-2.5"
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
        selectedMarkerOfficialImgs={selectedMarkerOfficialImgs}
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
