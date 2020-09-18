import React from 'react';
// import { InlineShareButtons } from 'sharethis-reactjs';
// import { useTranslation } from './app-state';

import './SocialShare.scss';

interface SocialShareProps {
  name: string;
  description: string;
  imageHref: string;
}

export const SocialShare: React.FC<SocialShareProps> = (props) => {
  // const { t } = useTranslation();

  return (
    <div className="socialshare">
      {/* <InlineShareButtons
        config={{
          alignment: 'left', // alignment of buttons (left, center, right)
          color: 'social', // set the color of buttons (social, white)
          enabled: true, // show/hide buttons (true, false)
          font_size: 16, // font size for the buttons
          labels: 'cta', // button labels (cta, counts, null)
          networks: [ // which networks to include (see SHARING NETWORKS)
            'facebook',
            'twitter',
            'pinterest',
            'email',
          ],
          padding: 12, // padding within buttons (INTEGER)
          radius: 4, // the corner radius on each button (INTEGER)
          size: 40, // the size of each button (INTEGER)
          show_total: false,
          image: props.imageHref, // (defaults to og:image or twitter:image)
          description: props.description, // (defaults to og:description or twitter:description)
          title: t('social-share-title', { productName: props.name }), // (defaults to og:title or twitter:title)
          subject: t('social-share-subject', { productName: props.name }), // (defaults to og:title or twitter:title)
          message: t('social-share-message', { productName: props.name, description: props.description, link: window.location.href }), // (defaults to og:title or twitter:title)
        }}
      /> */}
    </div>
  );
};
