import { PlusIcon } from "@heroicons/react/24/outline";
import { Button, Input, message, Modal, Radio, Select } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useCreateVendorMutation } from "../../app/features/api/vendorsApiSlice";

const VendorsHeader = () => {
  const auth = useSelector((state) => state.auth);

  const [createVendor, result] = useCreateVendorMutation();

  // local states
  const [isCreateVendorModalVisible, setIsCreateVendorModalVisible] =
    useState(false);
  const [order, setOrder] = useState("asc");
  const [displayName, setDisplayName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [contact, setContact] = useState("");

  // handles
  const handleSearch = () => {};

  const handleCreateVendor = () => {
    if (!displayName) {
      message.error("Display name is required!");
      return;
    }

    createVendor({
      display_name: displayName,
      company_name: companyName,
      email,
      phone,
      website,
      contact,
    }).then((res) => {
      if (res.data?.success) {
        message.success("New vendor created successfully!");
        setIsCreateVendorModalVisible(false);
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
            onClick={() => setIsCreateVendorModalVisible((prev) => !prev)}
            disabled={
              !(
                auth.permissions.suppliers.includes("W") ||
                auth.permissions.suppliers.includes("D")
              )
            }
          >
            <PlusIcon className="h-5 w-5 " />
            <span>Create Vendor</span>
          </Button>

          <div className="flex items-center justify-center gap-2 mt-2 md:mt-0">
            <Select placeholder="Sort" className="min-w-[100px]">
              {/* <Select.Option value="name">Name</Select.Option>
              <Select.Option value="qty">Quantity</Select.Option>
              <Select.Option value="expiry">Expiry</Select.Option> */}
            </Select>

            <Radio.Group
              value={order}
              onChange={(e) => setOrder(e.target.value)}
            >
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
            />
            <Button type="primary" onClick={handleSearch}>
              Search
            </Button>
          </Input.Group>
        </div>
      </div>

      <Modal
        title="Create Vendor"
        open={isCreateVendorModalVisible}
        onCancel={() => setIsCreateVendorModalVisible((prev) => !prev)}
        footer={[
          <Button
            key="back"
            onClick={() => setIsCreateVendorModalVisible((prev) => !prev)}
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            style={{ backgroundColor: "#22c55e" }}
            loading={result.isLoading}
            onClick={handleCreateVendor}
          >
            Create
          </Button>,
        ]}
      >
        <Input
          placeholder="Enter vendor display name"
          className="my-2"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
        <Input
          placeholder="Enter company name"
          className="my-2"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
        <Input
          placeholder="Enter email"
          className="my-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          placeholder="Enter phone"
          className="my-2"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <Input
          placeholder="Enter website"
          className="my-2"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
        <Input.TextArea
          placeholder="Enter contact address"
          className="mt-2 mb-5"
          rows={4}
          value={contact}
          onChange={(e) => setContact(e.target.value)}
        />
      </Modal>
    </>
  );
};

export default VendorsHeader;
