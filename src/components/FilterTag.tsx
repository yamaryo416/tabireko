import { Tag } from "@/types/tag";
import {
  Button,
  Checkbox,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";

type PropsType = {
  isDisplayBaloon: boolean;
  tagList: Tag[];
  isOpenFilterTagModal: boolean;
  filterTagIds: number[];
  setIsDisplayBaloon: Dispatch<SetStateAction<boolean>>;
  setFilterTagIds: Dispatch<SetStateAction<number[]>>;
  onOpenFilterTagModal: () => void;
  toggleFilterTagIds: (id: number) => void;
  onCloseFilterTagModal: () => void;
};

export const FilterTag = ({
  isDisplayBaloon,
  tagList,
  isOpenFilterTagModal,
  filterTagIds,
  setFilterTagIds,
  setIsDisplayBaloon,
  onOpenFilterTagModal,
  toggleFilterTagIds,
  onCloseFilterTagModal,
}: PropsType) => {
  if (tagList.length === 0) return <></>;
  return (
    <>
      <div className="flex justify-between">
        <Link
          onClick={() =>
            setIsDisplayBaloon((prevIsDisplayBaloon) => !prevIsDisplayBaloon)
          }
        >
          {isDisplayBaloon ? "ふきだしOFF" : "ふきだしON"}
        </Link>
        <Link onClick={onOpenFilterTagModal}>タグで絞り込み</Link>
      </div>
      <Modal
        placement="center"
        isOpen={isOpenFilterTagModal}
        onClose={onCloseFilterTagModal}
        isDismissable={false}
        className="mx-10"
      >
        <ModalContent>
          <ModalHeader>タグでの絞り込み</ModalHeader>
          <ModalBody>
            {tagList.map((tag) => (
              <Checkbox
                isSelected={filterTagIds.includes(tag.id)}
                key={tag.id}
                onClick={() => toggleFilterTagIds(tag.id)}
              >
                <span className="flex items-center">
                  {tag.icon && (
                    <Image
                      alt="マップのアイコン"
                      src={tag.icon?.url}
                      width={20}
                      height={50}
                    />
                  )}
                  <span>{tag.name}</span>
                </span>
              </Checkbox>
            ))}
            <Checkbox
              isSelected={filterTagIds.includes(0)}
              onClick={() => toggleFilterTagIds(0)}
            >
              タグなし
            </Checkbox>
            <Link onClick={() => setFilterTagIds([])}>チェックを全て外す</Link>
            <Button
              type="button"
              color="primary"
              variant="light"
              onPress={onCloseFilterTagModal}
            >
              閉じる
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
