import React, { useState, useEffect } from 'react';
import { Header } from '../../layout/Header';
import styles from '../../../styles/connectionRequests.module.scss';
import en from '../../../Utils/languages/producerPage/en.json';
import it from '../../../Utils/languages/producerPage/it.json';
import fr from '../../../Utils/languages/producerPage/fr.json';
import es from '../../../Utils/languages/producerPage/es.json';
import sv from '../../../Utils/languages/producerPage/sv.json';
import pt from '../../../Utils/languages/producerPage/pt.json';
import el from '../../../Utils/languages/producerPage/el.json';
import bg from '../../../Utils/languages/producerPage/bg.json';
import hr from '../../../Utils/languages/producerPage/hr.json';
import cs from '../../../Utils/languages/producerPage/cs.json';
import da from '../../../Utils/languages/producerPage/da.json';
import nl from '../../../Utils/languages/producerPage/nl.json';
import et from '../../../Utils/languages/producerPage/et.json';
import fi from '../../../Utils/languages/producerPage/fi.json';
import de from '../../../Utils/languages/producerPage/de.json';
import hu from '../../../Utils/languages/producerPage/hu.json';
import ga from '../../../Utils/languages/producerPage/ga.json';
import lv from '../../../Utils/languages/producerPage/lv.json';
import lt from '../../../Utils/languages/producerPage/lt.json';
import mt from '../../../Utils/languages/producerPage/mt.json';
import pl from '../../../Utils/languages/producerPage/pl.json';
import ro from '../../../Utils/languages/producerPage/ro.json';
import sk from '../../../Utils/languages/producerPage/sk.json';
import sl from '../../../Utils/languages/producerPage/sl.json';
import {
  getAllUsers,
  getConnectionRequests,
  updateConnectionStatus,
} from '../../../Services/connectionService';
import { Modal } from '../../layout/Modal';
import { Footer } from '../../layout/Footer';

export const ConnectionRequests = () => {
  const [connectionRequests, setConnectionRequests] = useState([]);
  const [translatedText, setTranslatedText] = useState({});
  const [language, setLanguage] = useState(
    localStorage.getItem('language') || ''
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  useEffect(() => {
    switch (language) {
      case 'en':
      default:
        setTranslatedText(en);
        break;
      case 'it':
        setTranslatedText(it);
        break;
      case 'fr':
        setTranslatedText(fr);
        break;
      case 'es':
        setTranslatedText(es);
        break;
      case 'sv':
        setTranslatedText(sv);
        break;
      case 'pt':
        setTranslatedText(pt);
        break;
      case 'el':
        setTranslatedText(el);
        break;
      case 'bg':
        setTranslatedText(bg);
        break;
      case 'hr':
        setTranslatedText(hr);
        break;
      case 'cs':
        setTranslatedText(cs);
        break;
      case 'da':
        setTranslatedText(da);
        break;
      case 'nl':
        setTranslatedText(nl);
        break;
      case 'et':
        setTranslatedText(et);
        break;
      case 'fi':
        setTranslatedText(fi);
        break;
      case 'de':
        setTranslatedText(de);
        break;
      case 'hu':
        setTranslatedText(hu);
        break;
      case 'ga':
        setTranslatedText(ga);
        break;
      case 'lv':
        setTranslatedText(lv);
        break;
      case 'lt':
        setTranslatedText(lt);
        break;
      case 'mt':
        setTranslatedText(mt);
        break;
      case 'pl':
        setTranslatedText(pl);
        break;
      case 'ro':
        setTranslatedText(ro);
        break;
      case 'sk':
        setTranslatedText(sk);
        break;
      case 'sl':
        setTranslatedText(sl);
        break;
    }
  }, [language]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const userList = await getAllUsers();
        setUsers(userList);
      } catch (error) {
        console.error('Error loading importers:', error);
      }
    };

    loadUsers();
  }, []);

  useEffect(() => {
    const fetchConnectionRequests = async () => {
      try {
        const fetchedConnections = await getConnectionRequests();
        // Filter for pending requests only
        const pendingConnections = fetchedConnections.filter(
          (connection) => connection.Status === 'PENDING'
        );
        setConnectionRequests(pendingConnections);
      } catch (error) {
        console.error('Error fetching connection requests:', error);
      }
    };

    fetchConnectionRequests();
  }, [
    Object.values(connectionRequests)
      .map((conn) => conn?.Status)
      .join(','),
  ]);

  const showModal = (message) => {
    setModalMessage(message);
  };

  const handleModalClose = () => {
    setModalMessage('');
  };

  const handleUpdateStatus = async (connectionID, status) => {
    try {
      const connectionData = await updateConnectionStatus(connectionID, status);
      // Refresh connection requests after updating status
      const fetchedConnections = await getConnectionRequests();
      const pendingConnections = fetchedConnections.filter(
        (connection) => connection.Status === 'PENDING'
      );
      setConnectionRequests(pendingConnections);

      console.log(status);

      if (connectionData && status === 'ACCEPTED') {
        showModal('Successfully accepted connection request with importer!');
      } else {
        showModal('Rejected connection request with producer.');
      }
    } catch (error) {
      console.error('Error updating connection request:', error);
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.FullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.Email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.Company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get the list of importers who have pending requests
  const importersWithPendingRequests = connectionRequests.map(
    (request) => request.ImporterID
  );

  return (
    <>
      <Header translatedText={translatedText} />
      <div className={styles.pageWrapper}>
        <div className={styles.headerSection}>
          <h1 className={styles.pageTitle}>{'Connection Requests'}</h1>
          <input
            type='text'
            placeholder={'Search importers'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.productGrid}>
          {connectionRequests.length === 0 ? (
            <div className={styles.noRequestsMessage}>
              <p>{'No pending connection requests'}</p>
            </div>
          ) : (
            <ul className={styles.productList}>
              {filteredUsers
                .filter((user) =>
                  importersWithPendingRequests.includes(user.UserID)
                )
                .map((user) => {
                  const request = connectionRequests.find(
                    (req) => req.ImporterID === user.UserID
                  );
                  return (
                    <li key={user.UserID} className={styles.productListItem}>
                      <div className={styles.productCard}>
                        <h3>{user.FullName}</h3>
                        <p>
                          {translatedText['Company'] || 'Company'}:{' '}
                          {user.Company}
                        </p>
                        <p>
                          {translatedText['Email'] || 'Email'}: {user.Email}
                        </p>
                        <div className={styles.buttonContainer}>
                          <button
                            onClick={() =>
                              handleUpdateStatus(
                                request.ConnectionID,
                                'ACCEPTED'
                              )
                            }
                            className={`${styles.actionButton} ${styles.acceptButton}`}
                          >
                            {'Accept'}
                          </button>
                          <button
                            onClick={() =>
                              handleUpdateStatus(
                                request.ConnectionID,
                                'REJECTED'
                              )
                            }
                            className={`${styles.actionButton} ${styles.rejectButton}`}
                          >
                            {'Reject'}
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
            </ul>
          )}
        </div>
      </div>
      <Modal
        message={modalMessage}
        onClose={handleModalClose}
        translatedText={translatedText}
      />
      <Footer translatedText={translatedText} />
    </>
  );
};
