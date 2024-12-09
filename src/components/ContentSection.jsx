import React from 'react';
import './ContentSection.css';
import './VideoSection';
import VideoSection from './VideoSection';

function ContentSection() {
    return (
      <div className="content-container">
        <div className="content">
          <h1 className="content-title">Cíle projektu</h1>
          <p className="content-description">
            Tento projekt se zaměřuje na vytvoření bezpečné a efektivní komunikace mezi Asterisk PBX a Kamailio pomocí TLS a certifikátů.
            Hlavními cíli bylo zajistit bezpečnost, spolehlivost a jednoduchou konfiguraci.
          </p>
          <div>
      <section>
        <h2>Popis tématu</h2>
        <p>
          Tento projekt se zaměřuje na implementaci bezpečného SIP trunku mezi
          Asterisk PBXs využívajícího TLS (Transport Layer Security) pro šifrování
          signalizace a SRTP (Secure Real-Time Transport Protocol) pro šifrování
          mediálních streamů. Cílem je zajistit bezpečnou hlasovou komunikaci ve
          VoIP sítích, aby se zabránilo odposlechu a dalším bezpečnostním hrozbám.
        </p>
        <p>
          Aktuální stav technologie zahrnuje různé šifrovací protokoly, přičemž TLS
          a SRTP jsou nejčastěji používané díky své robustní bezpečnosti a
          kompatibilitě se stávající infrastrukturou SIP.
        </p>
      </section>

      <section>
        <h2>Řešení úkolu</h2>
        <p>
          Řešení spočívá v konfiguraci Asterisk PBX a Kamailio serverů pro vytvoření
          bezpečného SIP trunku. Proces zahrnuje následující kroky:
        </p>

        <h3>Nastavení Asterisk PBX</h3>
          <li>
            <b>Generování SSL certifikátů:</b> Použijte nástroj jako `openssl` pro
            vytvoření samopodepsaného certifikátu nebo certifikátu od důvěryhodné CA.
            <pre>
              {`openssl genrsa -out ca.key 2048
openssl req -x509 -new -nodes -key ca.key -sha256 -days 365 -out ca.crt

openssl genrsa -out asterisk.key 2048
openssl req -new -key asterisk.key -out asterisk.csr

openssl x509 -req -in asterisk.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out asterisk.crt -days 365 -sha256
`}
            </pre>
          </li>
          <li>
            <b>Konfigurace TLS:</b> Upravit soubor `pjsip.conf` pro aktivaci TLS:
            <pre>
              {`[simpletrans]
type=transport
protocol=tls
bind=0.0.0.0:5071
cert_file=/etc/asterisk/keys/asterisk.crt
priv_key_file=/etc/asterisk/keys/asterisk.key
verify_server=no
method=tlsv1_2`}
            </pre>
          </li>
          <li>
            <b>Nastavení klapky 3001 v souboru pjsip.conf:</b>
            <pre>
              {`[3001]
type = endpoint
context = internal
disallow = all
allow = ulaw
aors = 3001
auth = auth3001
media_encryption=sdes
[3001]
type = aor
max_contacts = 10
[auth3001]
type=auth
auth_type=userpass
password=1234
username=3001
`}
            </pre>
          </li>
        <h3>Nastavení Kamailio</h3>
          <li>
            <b>Inicializace databáze uživatelů a jejich registrace</b>
            <pre>
              {`kamdbctl create
kamctl add 2000 1234
kamctl add 2001 1234
`}
            </pre>
          </li>
          <li>
            <b>Nastavení TLS modulu v rámci kamailio.cfg:</b>
            <pre>
              {`#!define WITH_TLS
loadmodule "tls.so"
listen=tls:158.196.244.207:5061
modparam("tls", "config", "/etc/kamailio/tls.cfg")
modparam("tls", "tls_force_run", 11)
`}
            </pre>
          </li>
          <li>
            <b>Konfigurace souboru tls.cfg:</b> Definujeme parametry pro TLS:
            <pre>
              {`[server:default]
method = TLSv1.2+
verify_certificate = no
require_certificate = no
private_key = /etc/kamailio/kamailio.key
certificate = /etc/kamailio/kamailio.crt

[client:default]
verify_certificate = no
require_certificate = no
`}
            </pre>
          </li>
          <h3>Nastavení Trunk na Asterisk</h3>
          <li>
            <b>Nastavení trunku v souboru pjsip.conf:</b> Definujeme trunk pro Kamailio:
            <pre>
              {`[trunk-kamailio]
type = endpoint
context = from-kamailio
disallow = all
allow = ulaw
aors = kamailio_aor
transport = simpletrans
media_encryption = sdes
auth = kamailio_auth
[kamailio_aor]
type = aor
contact = sip:158.196.244.207:5061
[kamailio_auth]
type = auth
auth_type = userpass
password = 1234
username = 2000`}
            </pre>
          </li>
          <li>
            <b>Nastavení směrování SIP provozu pro extensions.conf:</b>
            <pre><code>
              {`[from-kamailio]
exten => _X.,1,NoOp(Prichozi hovor z Kamailia: \${EXTEN})
exten => _X.,n,Answer()
exten => _X.,n,Dial(PJSIP/\${EXTEN})
exten => _X.,n,Hangup()
[internal]
exten => _X.,1,Dial(PJSIP/\${EXTEN}@trunk-kamailio)`}
            </code>
            </pre>
          </li>
          <h3>Nastavení Trunk na Kamailio</h3>
          <li>
            <b>Úprava směrování SIP provozu v souboru kamailio.cfg</b>
            <pre>
              {`        if (src_ip == "158.196.244.207") {
                log("Incoming call from Asterisk\\n");
                route(LOCATION);
                exit;
        }
        if ($rU =~ "^[0-9]+$") {
                log("Incoming call to Asterisk: $rU\\n");
                $du = "sip:158.196.244.207:5071";
                forward();
                exit;
        }
        route[AUTH]
        if (is_method("REGISTER") || is_method("INVITE") || from_uri==myself) {
                # authenticate requests
                if (!auth_check("$fd", "subscriber", "1")) {
                        auth_challenge("$fd", "0");
                        exit;
                }
        
        route[SIPOUT] {
          if ($rU =~ "^[0-9]+$") {
              t_relay_to_tls("158.196.244.207","5071");
              exit;
          }
          append_hf("P-Hint: outbound\\r\\n");
          route(RELAY);
          exit;
        }`}
            </pre>
          </li>
      </section>
      <VideoSection />
      <section>
        <h2>Závěr a výsledky</h2>
        <p>
          Projekt úspěšně implementoval bezpečný SIP trunk mezi Asterisk PBX a
          Kamailio. Použití TLS a SRTP zajišťuje šifrování signalizace i mediálních
          streamů, což významně zvyšuje bezpečnost komunikace.
        </p>
      </section>
    </div>


        </div>
      </div>
    );
  }
  
  export default ContentSection;