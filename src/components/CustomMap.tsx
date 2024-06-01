import { GoogleMap, InfoWindow, Marker } from "@react-google-maps/api"
import Image from "next/image"

import { useMarkerListStore } from "../../store/marker-list"
import { useMapOptionStore } from "../../store/map-option"
import { useDisplayMapModeStore } from "../../store/map-display-mode"
import { useEachImgListStore } from "../../store/each-img-list"
import { useMapController } from "@/hooks/use-map-controller"

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

export const CustomMap = () => {
  const { markerList } = useMarkerListStore()
  const { mapOption } = useMapOptionStore()
  const { displayMapMode } = useDisplayMapModeStore()
  const { eachImgList } = useEachImgListStore()

  const {
    onClickCurrentLoaction,
    openCreateMarkerModal,
    onOpenDetailMarker,
    markerFilter,
  } = useMapController()

  return (
    <div className="relative">
      <GoogleMap
        mapContainerStyle={defaultMapContainerStyle}
        center={mapOption.center}
        zoom={mapOption.zoom}
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
            {displayMapMode === "balloon" && (
              <InfoWindow position={{ lat: marker.lat, lng: marker.lng }}>
                <button onClick={() => onOpenDetailMarker(marker)}>
                  {marker.title}
                </button>
              </InfoWindow>
            )}
            {displayMapMode === "img" && (
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
  )
}
