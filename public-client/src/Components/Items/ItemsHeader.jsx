import { useState } from "react";
import { Button, Input, message, Modal, Radio, Select } from "antd";
import { QrReader } from "react-qr-reader";
import { PlusIcon, QrCodeIcon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  useAddCategoryMutation,
  useCreateItemMutation,
  useGetCategoriesQuery,
} from "../../app/features/api/itemsApiSlice";
import { useSelector } from "react-redux";

const ItemsHeader = ({
  searchText,
  setSearchText,
  setIsSearchQrModalVisible,
  setSortby,
  setSortorder,
}) => {
  const auth = useSelector((state) => state.auth);

  const { data: categoriesData } = useGetCategoriesQuery();
  const [createItem, result] = useCreateItemMutation();
  const [addCategory, addCategoryResult] = useAddCategoryMutation();

  // local states
  const [isCreateItemModalVisible, setIsCreateItemModalVisible] =
    useState(false);
  const [isQrModalVisible, setIsQrModalVisible] = useState(false);

  // create item states
  const [name, setName] = useState("");
  const [qty, setQty] = useState(null);
  const [sku, setSku] = useState("");
  const [shelf, setShelf] = useState("");
  const [status, setStatus] = useState("on stock");
  const [category, setCategory] = useState("Others");
  const [stockWarningQuantity, setStockWarningQuantity] = useState(null);
  const [expiryDate, setExpiryDate] = useState("");
  const [qrText, setQrText] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");

  // handles
  const handleSearch = () => {};

  const handleCreateItem = () => {
    if (!name || !qty) {
      message.error("Name and Quantity are required!");
      return;
    }
    createItem({
      name,
      qty,
      sku: sku || qrText,
      shelf,
      status,
      category,
      low_stock_warning_qty: stockWarningQuantity,
      expiry_date: expiryDate,
    }).then((res) => {
      if (res.data?.success) {
        message.success("New item created successfully!");
        setIsCreateItemModalVisible(false);
      } else {
        message.error("Something went wrong!");
      }
    });
  };

  return (
    <>
      <div className="flex items-start md:items-center md:justify-around  md:mt-4 flex-col md:flex-row">
        <div className="md:flex gap-4">
          <Button
            type="primary"
            className="font-bold bg-green-500 flex items-center justify-center gap-x-2"
            onClick={() => setIsCreateItemModalVisible((prev) => !prev)}
            disabled={
              !(
                auth.permissions.items.includes("W") ||
                auth.permissions.items.includes("D")
              )
            }
          >
            <PlusIcon className="h-5 w-5 " />
            <span>Create Item</span>
          </Button>

          <div className="flex items-center justify-center gap-2 mt-2 md:mt-0">
            <Select
              placeholder="Sort"
              className="min-w-[100px]"
              onChange={(value) => {
                setSortby(value);
              }}
            >
              <Select.Option value="qty">Quantity</Select.Option>
              <Select.Option value="expiry_date">Expiry</Select.Option>
            </Select>

            <Radio.Group onChange={(e) => setSortorder(e.target.value)}>
              <Radio.Button value="asc">Ascending</Radio.Button>
              <Radio.Button value="desc">Descending</Radio.Button>
            </Radio.Group>
          </div>
        </div>

        <div className="flex items-center justify-center gap-x-1 mt-2 md:mt-0">
          <Input.Group compact>
            <Input
              style={{ width: "calc(100% - 100px)" }}
              allowClear
              placeholder="Enter keyword"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Button type="primary" onClick={handleSearch}>
              Search
            </Button>
          </Input.Group>
          <Button
            type="dashed"
            onClick={() => setIsSearchQrModalVisible((prev) => !prev)}
          >
            <QrCodeIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <Modal
        title="Create Item"
        open={isCreateItemModalVisible}
        onCancel={() => setIsCreateItemModalVisible((prev) => !prev)}
        footer={[
          <Button
            key="back"
            onClick={() => setIsCreateItemModalVisible((prev) => !prev)}
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            style={{ backgroundColor: "#22c55e" }}
            loading={result.isLoading}
            onClick={handleCreateItem}
          >
            Create
          </Button>,
        ]}
      >
        <div className="flex gap-2 mb-2">
          {qrText ? (
            <Input
              placeholder="Enter SKU"
              value={qrText}
              onChange={(e) => setQrText(e.target.value)}
            />
          ) : (
            <Input
              placeholder="Enter SKU"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
            />
          )}

          <Button
            type="dashed"
            onClick={() => {
              setIsCreateItemModalVisible(false);
              setIsQrModalVisible((prev) => !prev);
            }}
          >
            <QrCodeIcon className="h-5 w-5" />
          </Button>
        </div>

        <Input
          placeholder="Enter Name"
          value={name}
          className="my-2"
          onChange={(e) => setName(e.target.value)}
        />

        <div className="flex my-2">
          <Input
            placeholder="Enter Quantity"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            type="number"
          />
          <Input
            placeholder="Enter Shelf"
            value={shelf}
            onChange={(e) => setShelf(e.target.value)}
            className="ml-2"
          />
        </div>

        <Input
          placeholder="Enter expiry date (MM-DD-YYYY)"
          className="my-2"
          type="date"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
        />

        <div className="flex my-3 justify-around gap-x-2">
          <Select
            placeholder="Select Category"
            onChange={(e) => setCategory(e)}
            options={
              categoriesData?.categories?.map((category) => {
                return { value: category.name, label: category.name };
              }) || []
            }
          />
          <Input
            placeholder="Enter a new category"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
          <Button
            loading={addCategoryResult.isLoading}
            onClick={() => {
              addCategory({ name: newCategoryName }).then((res) => {
                if (res.data.success) {
                  message.success("Category added successfully");
                } else {
                  message.error("Something went wrong");
                }
              });
              setNewCategoryName("");
            }}
          >
            Add
          </Button>
        </div>
        <Select
          defaultValue="on stock"
          value={status}
          onChange={(e) => setStatus(e)}
          className="my-2"
        >
          <Select.Option value="on stock">On stock</Select.Option>
          <Select.Option value="low on stock">Low on stock</Select.Option>
          <Select.Option value="out of stock">Out of stock</Select.Option>
        </Select>
        <Input
          placeholder="Minimum stock before warning"
          type="number"
          className="mt-2 mb-4"
          value={stockWarningQuantity}
          onChange={(e) => setStockWarningQuantity(e.target.value)}
        />
      </Modal>

      <Modal
        title="QR Scanner"
        open={isQrModalVisible}
        onCancel={() => {
          setIsQrModalVisible((prev) => !prev);
          setIsCreateItemModalVisible((prev) => !prev);
        }}
        footer={[
          <Button
            key="back"
            onClick={() => {
              setIsQrModalVisible((prev) => !prev);
              setIsCreateItemModalVisible((prev) => !prev);
            }}
          >
            Cancel
          </Button>,
        ]}
      >
        <QrReader
          scanDelay={1000}
          constraints={{
            facingMode: "environment",
          }}
          onResult={(result, error) => {
            if (!!result) {
              console.log(result?.text);
              setQrText(result?.text);
              setIsQrModalVisible(false);
              setIsCreateItemModalVisible(true);
              message.success("QR code scanned successfully!");
            }
          }}
          onError={(error) => {
            console.info(error);
            message.error("QR code scanning failed! Please try again.");
            setIsQrModalVisible(false);
            setIsCreateItemModalVisible(true);
          }}
          style={{ width: "100%" }}
        />
      </Modal>
    </>
  );
};

export default ItemsHeader;
