import { PlusIcon } from "@heroicons/react/24/outline";
import {
  Button,
  Input,
  message,
  Modal,
  Popconfirm,
  Select,
  Spin,
  Table,
} from "antd";
import { format } from "date-fns";
import { useState } from "react";
import { useSelector } from "react-redux";
import {
  useCreateUserMutation,
  useDeleteUserMutation,
  useGetUsersQuery,
} from "../app/features/api/authApiSlice";

const getPermissionOptions = () => {
  const sections = ["items", "orders", "returns", "suppliers", "archives"];

  // for each section, create an array of options containing the permissions R,W,D example itemR, itemW, itemD
  const options = sections.map((section) => {
    const permissions = ["R", "W", "D"];
    const options = permissions.map((permission) => ({
      label: `${section}${permission}`,
      value: `${section}${permission}`,
    }));
    return options;
  });

  console.log(options);

  // flatten the array of arrays
  const flattenedOptions = options.flat();

  return flattenedOptions;
};

const Users = () => {
  const auth = useSelector((state) => state.auth);
  const { data, isLoading } = useGetUsersQuery();
  const [createUser, result] = useCreateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  // local states
  const [iseCreateUserModalVisible, setIsCreateUserModalVisible] =
    useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [permissions, setPermissions] = useState({
    items: "",
    orders: "",
    returns: "",
    suppliers: "",
    logs: "U",
    archives: "",
    users: "U",
  });

  if (auth.userData.role !== "Admin")
    return (
      <h1 className="text-center mt-24 text-red-300 uppercase">
        You are not authorized to view this page
      </h1>
    );

  // handles
  const handleCreateUser = () => {
    if (!role || !username || !password) {
      message.error("Username, password and role are required!");
      return;
    }
    if (
      role === "User" &&
      permissions.items === "" &&
      permissions.orders === "" &&
      permissions.returns === "" &&
      permissions.suppliers === "" &&
      permissions.archives === ""
    ) {
      message.error("Please select at least one permission for the user!");
      return;
    }

    createUser({
      name,
      username,
      password,
      role,
      permissions,
    }).then((res) => {
      if (!res.data.success) {
        message.error("Something went wrong!");
        return;
      }

      message.success("User created successfully!");
      setIsCreateUserModalVisible((prev) => !prev);
    });
  };

  const handleDelete = (id) => {
    deleteUser({ id }).then((res) => {
      if (res.data?.success) {
        message.success("User deleted successfully!");
      } else {
        message.error("Something went wrong!");
      }
    });
  };

  const handlePermissionChange = (value) => {
    const p = {
      items: "",
      orders: "",
      returns: "",
      suppliers: "",
      archives: "",
    };

    // if itemR is selected, concate items with R, if itemW is selected, concate items with W and R. if itemD is selected, concate items with D, W and R (& symbol will be between R, W and D)
    value.forEach((item) => {
      const section = item.slice(0, -1);
      const permission = item.slice(-1);
      if (permission === "R") {
        p[section] = "R";
      } else if (permission === "W") {
        p[section] = "R&W";
      } else if (permission === "D") {
        p[section] = "R&W&D";
      }
    });

    setPermissions(p);
  };

  // columns for table
  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      responsive: ["md"],
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => <p>{format(new Date(date), "dd-MM-yyyy")}</p>,
      responsive: ["md"],
    },
    {
      title: "Action",
      key: "action",
      render: (_, item) => (
        <Popconfirm
          placement="bottomRight"
          title={`Are you sure to terminate ${item.username}?`}
          onConfirm={() => handleDelete(item._id)}
          okText="Yes"
          cancelText="No"
        >
          <Button danger className="ml-2">
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <main className="mt-14 p-2 md:p-4 max-w-[1800px] mx-auto">
      <Button
        type="primary"
        className="font-bold bg-green-500 flex items-center justify-center gap-x-2 mx-auto mt-4 mb-3"
        onClick={() => setIsCreateUserModalVisible((prev) => !prev)}
      >
        <PlusIcon className="h-5 w-5 " />
        <span>Create User</span>
      </Button>

      {isLoading && (
        <div className="mt-8 mx-auto flex justify-center items-center min-h-[500px]">
          <Spin size="large" />
        </div>
      )}
      {!isLoading && (
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={data.users}
          className="mt-4 md:mt-8"
          pagination={false}
          key={(item) => item._id}
        />
      )}

      <Modal
        title="Create User"
        open={iseCreateUserModalVisible}
        onCancel={() => setIsCreateUserModalVisible((prev) => !prev)}
        footer={[
          <Button
            key="back"
            onClick={() => setIsCreateUserModalVisible((prev) => !prev)}
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            style={{ backgroundColor: "#22c55e" }}
            loading={result.isLoading}
            onClick={handleCreateUser}
          >
            Create
          </Button>,
        ]}
      >
        <Input
          placeholder="Enter username"
          className="my-2"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          placeholder="Enter name"
          className="my-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          placeholder="Enter password"
          className="my-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Select
          placeholder="Select role"
          className="mt-2 mb-4"
          style={{
            width: 120,
          }}
          options={[
            { label: "Admin", value: "Admin" },
            { label: "Manager", value: "User" },
          ]}
          onChange={(value) => setRole(value)}
        />
        {role === "User" && (
          <>
            <h3 className="text-lg font-bold">
              Permissions(Suffixes define permissions for each section)
            </h3>
            <p className="my-1">
              <span className="font-semibold">R </span> = Read( User will be
              able to <span className="font-bold text-primary">SEE</span> the
              section but can't{" "}
              <span className="font-bold text-primary">EDIT</span> or{" "}
              <span className="font-bold text-primary">DELETE</span> )
            </p>
            <p className="my-1">
              <span className="font-semibold">W </span> = Write( User will be
              able to <span className="font-bold text-primary">SEE</span> and
              <span className="font-bold text-primary"> EDIT</span> records from
              the section but can't
              <span className="font-bold text-primary"> DELETE</span> )
            </p>
            <p className="my-1 mb-3">
              <span className="font-semibold">D </span> = Droplet( User will be
              able to <span className="font-bold text-primary">SEE</span> ,
              <span className="font-bold text-primary"> EDIT</span> and{" "}
              <span className="font-bold text-primary"> DELETE</span> records
              from the section )
            </p>

            <Select
              placeholder="Type to select permissions(e.g: itemW)"
              mode="multiple"
              allowClear
              className="mt-2 mb-4"
              size="large"
              onChange={handlePermissionChange}
              options={getPermissionOptions()}
              style={{
                width: "100%",
              }}
            />
          </>
        )}
      </Modal>
    </main>
  );
};

export default Users;
