# Zwei Mini-Turbo-Stufen

Der aktive RaycastKartController lädt während eines gültigen Drifts zwei Stufen: ab 0,7 Sekunden Stufe I, ab 1,8 Sekunden Stufe II. Loslassen erzeugt 0,55 beziehungsweise 1,1 Sekunden zusätzlichen Schub. Ein bereits laufender längerer Boost wird dabei nicht verkürzt.

Die Anzeige verwendet dieselben Schwellen wie die Physik. Sie zeigt Ladefortschritt, Stufennummer und Loslasshinweis. Die Information ist auch ohne Farberkennung lesbar. Radnahe Funken und akustische Ladezeichen bleiben noch auszuarbeiten.

Der Regressionstest prüft die Schwellen und die längere zweite Boostdauer. Fahrprüfung beider Stufen in Links- und Rechtsdrifts sowie Balanceprüfung sind weiterhin erforderlich.
