import React, { useState, useEffect } from 'react';
import styles from '../../styles/connectWithProducer.module.scss';
import {
  createConnectionRequest,
  getAllUsers,
  getConnectionRequests,
} from '../../Services/connectionService';
import { Header } from '../layout/Header';
import en from '../../Utils/languages/producerPage/en.json';
import it from '../../Utils/languages/producerPage/it.json';
import fr from '../../Utils/languages/producerPage/fr.json';
import es from '../../Utils/languages/producerPage/es.json';
import sv from '../../Utils/languages/producerPage/sv.json';
import pt from '../../Utils/languages/producerPage/pt.json';
import el from '../../Utils/languages/producerPage/el.json';
import bg from '../../Utils/languages/producerPage/bg.json';
import hr from '../../Utils/languages/producerPage/hr.json';
import cs from '../../Utils/languages/producerPage/cs.json';
import da from '../../Utils/languages/producerPage/da.json';
import nl from '../../Utils/languages/producerPage/nl.json';
import et from '../../Utils/languages/producerPage/et.json';
import fi from '../../Utils/languages/producerPage/fi.json';
import de from '../../Utils/languages/producerPage/de.json';
import hu from '../../Utils/languages/producerPage/hu.json';
import ga from '../../Utils/languages/producerPage/ga.json';
import lv from '../../Utils/languages/producerPage/lv.json';
import lt from '../../Utils/languages/producerPage/lt.json';
import mt from '../../Utils/languages/producerPage/mt.json';
import pl from '../../Utils/languages/producerPage/pl.json';
import ro from '../../Utils/languages/producerPage/ro.json';
import sk from '../../Utils/languages/producerPage/sk.json';
import sl from '../../Utils/languages/producerPage/sl.json';
import { Modal } from '../layout/Modal';
import { Footer } from '../layout/Footer';

export const ConnectWithProducer = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [connectionRequest, setConnectionRequest] = useState({});
  const [translatedText, setTranslatedText] = useState({});
  const [language, setLanguage] = useState(
    localStorage.getItem('language') || ''
  );
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const handleLanguageChange = (e) => setLanguage(e.target.value);

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
        console.error('Error loading producers:', error);
      }
    };

    loadUsers();
  }, []);

  useEffect(() => {
    const fetchConnectionRequests = async () => {
      try {
        let fetchConnections = await getConnectionRequests();

        // Find the connection for the current producer
        fetchConnections.forEach((connection) => {
          if (connection.ConnectionID && connection.ProducerID) {
            setConnectionRequest((prevState) => ({
              ...prevState,
              [connection.ProducerID]: connection,
            }));
          }
        });
      } catch (error) {
        console.error('Error fetching connection requests:', error);
      }
    };

    fetchConnectionRequests();
  }, [
    Object.values(connectionRequest)
      .map((conn) => conn?.Status)
      .join(','),
  ]);

  const showModal = (message) => {
    setModalMessage(message);
  };

  const handleModalClose = () => {
    setModalMessage('');
  };

  const handleConnectRequest = async (producerID, status) => {
    try {
      const connectionData = await createConnectionRequest(producerID, status);
      // Refresh connection requests after creating a new one
      const requests = await getConnectionRequests();
      if (requests && requests.length > 0) {
        setConnectionRequest(requests[0]);
      }

      if (connectionData)
        setTimeout(
          () => showModal('Successfully send connection request to producer!'),
          300
        );
    } catch (error) {
      console.error('Error creating connection request:', error);
    }
  };

  const getButtonText = (producerID) => {
    const connection = connectionRequest[producerID];

    if (!connection || !connection.ConnectionID) {
      return translatedText['Connect'] || 'Connect';
    }

    if (connection.Status === 'PENDING') {
      return translatedText['Pending...'] || 'Pending...';
    } else if (connection.Status === 'ACCEPTED') {
      return translatedText['Connected'] || 'Connected';
    } else if (connection.Status === 'REJECTED') {
      return translatedText['Connect'] || 'Connect';
    } else {
      return translatedText['Connect'] || 'Connect';
    }
  };

  const getButtonStyles = (producerID) => {
    const connection = connectionRequest[producerID];
    const baseStyles = styles.connectButton;

    if (!connection || !connection.ConnectionID) {
      return baseStyles;
    }

    if (connection.Status === 'PENDING') {
      return `${baseStyles} ${styles.pending}`;
    } else if (connection.Status === 'ACCEPTED') {
      return `${baseStyles} ${styles.connected}`;
    } else {
      return baseStyles;
    }
  };

  const filteredProducers = users.filter(
    (producer) =>
      producer.FullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producer.Email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producer.Company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Header translatedText={translatedText} />
      <div className={styles.pageWrapper}>
        <div className={styles.headerSection}>
          <h1 className={styles.pageTitle}>
            {translatedText['Connect with Producers'] ||
              'Connect with Producers'}
          </h1>
          <input
            type='text'
            placeholder={
              translatedText['Search producers...'] || 'Search producers...'
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.productGrid}>
          <ul className={styles.productList}>
            {filteredProducers.map(
              (producer) =>
                producer.Role === 'Producer' && (
                  <li key={producer.UserID} className={styles.productListItem}>
                    <div className={styles.productCard}>
                      <h3>{producer.FullName}</h3>
                      <p>Email: {producer.Email}</p>
                      <p>Company: {producer.Company}</p>
                      <button
                        className={getButtonStyles(producer.UserID)}
                        onClick={() =>
                          handleConnectRequest(producer.UserID, 'PENDING')
                        }
                        disabled={
                          connectionRequest[producer.UserID]?.Status ===
                            'PENDING' ||
                          connectionRequest[producer.UserID]?.Status ===
                            'ACCEPTED'
                        }
                      >
                        {getButtonText(producer.UserID)}
                      </button>
                    </div>
                  </li>
                )
            )}
          </ul>
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
