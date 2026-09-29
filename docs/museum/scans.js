/* The Divine Archives — Virtual Museum: real 3D scans of the Vault objects

   Each entry points to a published 3D scan of the actual object on Sketchfab. The scan is
   shown in Sketchfab's own embedded viewer, loaded in the visitor's browser straight from
   Sketchfab only when they ask for it; nothing is copied into this site. This is the same
   rule the Vault's image viewer follows for manuscripts.

   kind — "museum": published by the holding museum or an official heritage body
          "independent": a scan of the real object by a professional or independent maker
   what — which object or part the scan shows, when it is not the whole thing
   Only scans whose subject and maker are clear are listed. Casts, replicas, imitations and
   reconstructions are excluded, and so are the Benin Bronzes, pending the archive's decision
   on objects whose return is claimed. */

export const SCANS = {
  v53: { uid: "1e03509704a3490e99a173e53b93e282", by: "The British Museum", kind: "museum" },
  v59: { uid: "5106f5a1a1da44dab4e953b75726b240", by: "the Natural History Museum Vienna", kind: "museum" },
  v58: { uid: "6400b5f7a6db4305ab3ae0836658517b", by: "the State Office for Monument Preservation, Baden-Württemberg (a CT scan)", kind: "museum" },
  v55: { uid: "ec30118266de4f318031ee1804a0eefb", by: "the British Library", kind: "museum", what: "one inscribed oracle bone, Or 7694/1655+1672" },
  v70: { uid: "54532d6cf4684016baba8ab9a0a040ea", by: "Historic Environment Scotland", kind: "museum", what: "the Roadside Cross at Aberlemno, a Pictish cross-slab" },
  v36: { uid: "4109035a52b34ada9afe6f566f15e04e", by: "Arkeologerna (The Archaeologists), Sweden's public archaeology service", kind: "museum" },
  v71: { uid: "fa259dcf0eac46d889e0572abe4a994e", by: "Global Digital Heritage, a non-profit", kind: "independent", what: "stećci nos. 23 and 24 at Radimlja, near Stolac" },
  v47: { uid: "9fb245537e1144e8bb361c433926bf80", by: "Artec 3D", kind: "independent", what: "a simplified version of their full scan, for faster loading" },
  v43: { uid: "b1c1b7c155fb48e4803775a4bbc3c506", by: "an independent photographer (danderson4), at the Egyptian Museum, Cairo", kind: "independent" },
  v34: { uid: "ccfc7c2f43214b559e93c4857eb6ed4a", by: "an independent photographer (danderson4), inside the pyramid of Unas at Saqqara", kind: "independent", what: "the inscribed chambers themselves" },
  v35: { uid: "f8d0a48f63f44bb49323b623853f6592", by: "an independent photographer (artfletch), at the British Museum", kind: "independent" },
};

export function hasScan(id) { return !!SCANS[id]; }

// Sketchfab's embed: dnt=1 asks it not to track the viewer
export function scanEmbed(id) {
  const s = SCANS[id]; if (!s) return null;
  return { src: `https://sketchfab.com/models/${s.uid}/embed?autostart=1&ui_theme=dark&dnt=1&ui_hint=0`, page: `https://sketchfab.com/3d-models/${s.uid}`, s };
}
