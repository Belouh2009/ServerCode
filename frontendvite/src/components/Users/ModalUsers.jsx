import React from 'react';
import {
  Modal,
  Button,
  Descriptions,
  Input,
  Spin
} from "antd";
import {
  EditOutlined,
  ExclamationCircleOutlined
} from "@ant-design/icons";
import { MdOutlineManageAccounts } from "react-icons/md";

const ModalUser = ({
  isModalOpen,
  setIsModalOpen,
  isEditing,
  setIsEditing,
  editedInfo,
  setEditedInfo,
  loading,
  userInfo,
  saving,
  handleSaveChanges,
  userIcon
}) => {
  return (
    <Modal
      title={
        <div className="modal-title">
          <MdOutlineManageAccounts className="modal-title-icon" />
          {isEditing ? "Modifier mon compte" : "Informations du compte"}
        </div>
      }
      open={isModalOpen}
      onCancel={() => {
        setIsEditing(false);
        setIsModalOpen(false);
        if (editedInfo.tempImageUrl) {
          URL.revokeObjectURL(editedInfo.tempImageUrl);
        }
      }}
      footer={null}
      centered
      width={650}
      className="account-modal"
    >
      {loading ? (
        <div className="loading-container">
          <Spin size="large" tip="Chargement des informations..." />
        </div>
      ) : userInfo ? (
        <div className="account-info-container">
          <div className="account-header">
            <div className="avatar-section">
              <div className="avatar-container">
                <img
                  src={
                    editedInfo.tempImageUrl
                      ? editedInfo.tempImageUrl
                      : userInfo.image === "user.jpg"
                      ? userIcon
                      : `http://192.168.88.51:8087/uploads/${userInfo.image}`
                  }
                  alt="Profil"
                  className="profile-image"
                  onError={(e) => {
                    e.target.src = userIcon;
                  }}
                />
              </div>

              {isEditing && (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    id="uploadImageInput"
                    className="image-upload-input"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const imageUrl = URL.createObjectURL(file);
                        setEditedInfo({
                          ...editedInfo,
                          imageFile: file,
                          tempImageUrl: imageUrl,
                        });
                      }
                    }}
                  />
                  <Button
                    size="small"
                    icon={<EditOutlined />}
                    className="change-image-btn"
                    onClick={() =>
                      document.getElementById("uploadImageInput").click()
                    }
                  >
                    Modifier l'image
                  </Button>
                </>
              )}
            </div>

            <div className="user-info-section">
              <h3 className="user-fullname">
                {userInfo.nom} {userInfo.prenom}
              </h3>
              <p className="user-division">{userInfo.division}</p>
            </div>
          </div>

          <div className="account-details">
            <Descriptions
              column={1}
              size="middle"
              labelStyle={{
                fontWeight: "500",
                color: "#555",
                width: "150px",
                paddingBottom: "12px",
              }}
              contentStyle={{ fontWeight: "400", paddingBottom: "12px" }}
            >
              <Descriptions.Item label="Nom">
                {isEditing ? (
                  <Input
                    value={editedInfo.nom || userInfo.nom}
                    onChange={(e) =>
                      setEditedInfo({ ...editedInfo, nom: e.target.value })
                    }
                  />
                ) : (
                  <div>{userInfo.nom}</div>
                )}
              </Descriptions.Item>

              <Descriptions.Item label="Prénom">
                {isEditing ? (
                  <Input
                    value={editedInfo.prenom || userInfo.prenom}
                    onChange={(e) =>
                      setEditedInfo({
                        ...editedInfo,
                        prenom: e.target.value,
                      })
                    }
                  />
                ) : (
                  <div>{userInfo.prenom}</div>
                )}
              </Descriptions.Item>

              <Descriptions.Item label="Nom d'utilisateur">
                {isEditing ? (
                  <Input
                    value={editedInfo.username || userInfo.username}
                    onChange={(e) =>
                      setEditedInfo({
                        ...editedInfo,
                        username: e.target.value,
                      })
                    }
                  />
                ) : (
                  <div>{userInfo.username}</div>
                )}
              </Descriptions.Item>

              <Descriptions.Item label="Email">
                {isEditing ? (
                  <Input
                    value={editedInfo.email || userInfo.email}
                    onChange={(e) =>
                      setEditedInfo({
                        ...editedInfo,
                        email: e.target.value,
                      })
                    }
                  />
                ) : (
                  <a href={`mailto:${userInfo.email}`}>{userInfo.email}</a>
                )}
              </Descriptions.Item>

              {isEditing && (
                <Descriptions.Item label="Mot de passe">
                  <Input.Password
                    placeholder="Nouveau mot de passe"
                    value={editedInfo.password || ""}
                    onChange={(e) =>
                      setEditedInfo({
                        ...editedInfo,
                        password: e.target.value,
                      })
                    }
                  />
                  <div className="password-hint">
                    Laissez vide pour ne pas modifier
                  </div>
                </Descriptions.Item>
              )}
            </Descriptions>
          </div>

          <div className="modal-footer">
            <div className="last-update">
              Dernière mise à jour: {new Date().toLocaleDateString()}
            </div>
            <div className="action-buttons">
              {isEditing ? (
                <>
                  <Button
                    className="cancel-btn"
                    onClick={() => setIsEditing(false)}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="primary"
                    className="save-btn"
                    onClick={handleSaveChanges}
                    loading={saving}
                  >
                    Enregistrer
                  </Button>
                </>
              ) : (
                <Button
                  type="primary"
                  className="edit-btn"
                  onClick={() => {
                    setEditedInfo({ ...userInfo, password: "" });
                    setIsEditing(true);
                  }}
                  icon={<EditOutlined />}
                >
                  Modifier
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="no-user-info">
          <ExclamationCircleOutlined className="warning-icon" />
          <p>Aucune information utilisateur disponible</p>
          <Button
            type="primary"
            onClick={() => setIsModalOpen(false)}
            className="close-btn"
          >
            Fermer
          </Button>
        </div>
      )}
    </Modal>
  );
};

export default ModalUser;