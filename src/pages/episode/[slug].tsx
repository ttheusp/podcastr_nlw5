import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { usePlayer } from '../../contexts/PlayerContext';

import { api } from '../../services/api';
import convertDurationToTimeString from '../../utils/convertDurationToTimeString';

import styles from './episode.module.scss';

type Episode = {
    id: string;
    title: string;
    thumbnail: string;
    members: string;
    publishedAt: string;
    duration: number;
    durationAsString: string;
    description: string;
    url: string;
}

type EpisodeProps = {
    episode: Episode;
}

export default function Episode({ episode }: EpisodeProps) {
    const { play } = usePlayer()

    return (
        <div className={styles.episode}>
               <Head>
                    <title>{episode.title}</title>
                </Head>

            <div className={styles.thumbnailContainer}>
                <Link href="/">
                    <button type="button">
                        <img src="/arrow-left.svg" alt="Voltar" />
                    </button>
                </Link>
                <Image
                    width={700}
                    height={160}
                    src={episode.thumbnail}
                    objectFit="cover"
                />
                <button type="button" onClick={() => play(episode)}>
                    <img src="/play.svg" alt="Tocar episódio" />
                </button>
            </div>

            <header>
                <h1>{episode.title}</h1>
                <span>{episode.members}</span>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
            </header>

            <div
                className={styles.description}
                dangerouslySetInnerHTML={{ __html: episode.description }}
            />
        </div>
    );
}

// Toda vez que estamos gerando de forma dinâmica uma página estática, preciso informar o método getStaticPaths
export const getStaticPaths: GetStaticPaths = async () => {
    const { data } = await api.get('episodes', {
        params: {
            _limit: 2,
            _sort: 'published_at',
            _order: 'desc',
        }
    })

    const paths = data.map(episode => ({
        params: {
            slug: episode.id
        }
    }))

    return {
        // Em path informamos quais páginas queremos gerar de forma estática no momento da build. Nesse caso estamos colocando os dois últimos podcasts
        // fallback aceita três valores: true, 'blocking' ou false. 
        // fallback -> blocking or true = Incremental static regeneration. A página estática é gerada de forma incremental, ou seja, ela será gerada no primeiro acesso ou quando o revalidade for atingido. 
        // Blocking -> Só entra na página quando tudo estiver carregado, pois ela é gerada na camada do Next. True -> Entra enquanto vai carregando, pois ela é gerada no browser.
        // fallback -> false = A página não será carregada. Será retornado um 404 para às páginas que não foram geradas de forma estática.
        paths: [...paths],
        fallback: 'blocking'
    }

}

// ctc é uma propriedade passada contendo o contexto
export const getStaticProps: GetStaticProps = async (ctx) => {
    const { slug } = ctx.params;
    const { data } = await api.get(`/episodes/${slug}`);


    const episode = {
        id: data.id,
        title: data.title,
        thumbnail: data.thumbnail,
        members: data.members,
        publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }),
        duration: Number(data.file.duration),
        durationAsString: convertDurationToTimeString(Number(data.file.duration)),
        description: data.description,
        url: data.file.url
    }

    return {
        props: {
            episode
        },
        revalidate: 60 * 60 * 24, // 24 hours
    }
}