import { FC, useState, useEffect, useContext } from 'react';
import { ConfigContext } from '@/contexts/ConfigContext';
import { getUrls } from '@/utils/config';

const TopBar: FC = () => {
    //const [collectionsData, setCollectionsData] = useState([''])
    const { config, setConfig } = useContext(ConfigContext);
    const [urls, setUrls] = useState(getUrls(config.documents));
    const [labels, setLabels] = useState([]);

    const manifestLabels =
        labels.length > 0 &&
        labels.map((label, i) => (
            <div key={i} className="bg-slate-400 t-w-[100px]">
                {label}
            </div>
        ));

    useEffect(() => {
        async function initManifestsLabels(urls) {
            let list: string[] = [];
            if (!urls) return [''];
            urls.forEach((url) => {
                const label = getLabel(url);
                list.push(label);
            });
            Promise.all(list).then((values) => {
                setLabels(values);
            });
        }

        async function getLabel(url) {
            const apiData = await fetch(url);
            const data = await apiData.json();
            if (!data) return;
            if (data.sequence[0].type === 'manifest') {
                return data.sequence[0].label;
            }
            if (data.sequence[0].type === 'item') {
                return data.label;
            }
        }

        initManifestsLabels(urls);
    }, []);

    return <div>{manifestLabels}</div>;
};

export default TopBar;
